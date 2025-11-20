import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/client';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setTimeout(() => {
                setMessages([{
                    id: 1,
                    text: "Bonjour ! Comment pouvons-nous vous aider ?",
                    sender: 'bot'
                }]);
            }, 500);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '') return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        const messageToSend = inputValue;
        setInputValue('');

        try {
            await apiClient.post('/api/messages', {
                senderName: 'Visiteur du site',
                senderEmail: 'visitor@website.com', // Placeholder email
                subject: 'Question depuis le Chat Widget',
                message: messageToSend
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message via le chat:", error);
        }

        setTimeout(() => {
            const botResponse: Message = {
                id: Date.now() + 1,
                text: "Merci pour votre message. Un administrateur vous recontactera par email dans les plus brefs délais.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1500);
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-brand-red text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
                    aria-label="Ouvrir le chat"
                >
                    <AnimatePresence>
                        {isOpen ? (
                            <motion.svg key="close" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></motion.svg>
                        ) : (
                            <motion.svg key="open" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }} className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></motion.svg>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ ease: 'easeInOut', duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-brand-gray rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-700"
                    >
                        <header className="bg-brand-dark p-4 text-white font-bold text-center">
                            Contactez-nous
                        </header>
                        <div className="flex-grow p-4 overflow-y-auto bg-brand-dark">
                            <div className="space-y-4">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-brand-red text-white' : 'bg-gray-700 text-gray-200'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Posez votre question..."
                                className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
                            />
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;