import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LiveEvent, LiveChatMessage, Member } from '../types';
import apiClient from '../api/client';
import PaymentModal from '../components/PaymentModal';

interface LivePageProps {
    currentUser: Member | null;
}

const LivePage: React.FC<LivePageProps> = ({ currentUser }) => {
    const [event, setEvent] = useState<LiveEvent | null>(null);
    const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [hasPaid, setHasPaid] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                const eventData = await apiClient.get('/api/live/event');
                setEvent(eventData);

                if (eventData && eventData.status === 'live') {
                    const chatData = await apiClient.get('/api/live/chat');
                    setChatMessages(chatData);
                }
            } catch (err: any) {
                setError(err.message || "Erreur lors du chargement de l'événement.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, []);

    // Simulate new chat messages
    useEffect(() => {
        if (event?.status === 'live') {
            const interval = setInterval(() => {
                setChatMessages(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        author: 'Nouveau Visiteur',
                        message: 'Super intervention !',
                        timestamp: new Date().toISOString()
                    }
                ]);
            }, 7000);
            return () => clearInterval(interval);
        }
    }, [event]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handlePaymentConfirm = () => {
        setIsPaymentModalOpen(false);
        setHasPaid(true); // Grants access for the current session
    };


    if (isLoading) {
        return <div className="text-center py-20 text-2xl text-gray-400">Chargement du direct...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-2xl text-red-500">Erreur : {error}</div>;
    }

    if (!event || event.status === 'offline') {
        return (
            <div className="text-center py-20 bg-brand-gray rounded-lg">
                <h1 className="text-3xl font-bold mb-4">Aucun événement en direct</h1>
                <p className="text-gray-400">Revenez plus tard pour nos prochaines retransmissions.</p>
            </div>
        );
    }
    
    // --- Access Control Logic ---
    let accessGranted = false;
    let accessBlocker: React.ReactNode = null;

    if (currentUser) { // Members always have access
        accessGranted = true;
    } else {
        if (event.access.type === 'members_only') {
            accessBlocker = (
                <div className="absolute inset-0 bg-black flex flex-col justify-center items-center text-center p-8 rounded-md">
                    <h2 className="text-2xl font-bold mb-2">Contenu réservé aux membres</h2>
                    <p className="text-gray-400 mb-6">Veuillez vous connecter pour accéder à cette retransmission en direct.</p>
                    <Link to="/login" className="bg-brand-red text-white px-6 py-3 rounded-md font-semibold hover:bg-opacity-80 transition-colors">
                        Se Connecter
                    </Link>
                </div>
            );
        } else if (event.access.type === 'public') {
            if (event.access.cost === 0 || hasPaid) {
                accessGranted = true;
            } else { // Paid event, visitor has not paid
                accessBlocker = (
                    <div className="absolute inset-0 bg-black flex flex-col justify-center items-center text-center p-8 rounded-md">
                        <h2 className="text-2xl font-bold mb-2">Accès Payant</h2>
                        <p className="text-gray-400 mb-4">Cet événement est public mais nécessite un paiement pour y accéder.</p>
                        <p className="text-2xl font-bold text-brand-red mb-6">{event.access.cost.toLocaleString('fr-FR')} FCFA</p>
                        <button 
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors"
                        >
                            Payer pour Accéder
                        </button>
                    </div>
                );
            }
        }
    }


    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold mb-2">{event.title}</h1>
                    <p className="text-gray-400 max-w-3xl mx-auto">{event.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-brand-gray p-2 rounded-lg shadow-2xl">
                            <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 */}
                                {accessGranted ? (
                                    <iframe
                                        src={`${event.videoUrl}?autoplay=1&rel=0&controls=1`}
                                        title={event.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute top-0 left-0 w-full h-full rounded-md"
                                    ></iframe>
                                ) : (
                                    accessBlocker
                                )}
                            </div>
                            <div className="p-4 flex items-center">
                                <span className="relative flex h-3 w-3 mr-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-red"></span>
                                </span>
                                <span className="text-brand-red font-bold uppercase tracking-wider">En Direct</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-gray p-4 rounded-lg shadow-2xl flex flex-col max-h-[600px]">
                        <h3 className="text-xl font-bold border-b-2 border-brand-red pb-2 mb-4">Chat en direct</h3>
                        <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                            {chatMessages.map(msg => (
                                <motion.div 
                                    key={msg.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-sm"
                                >
                                    <span className="font-bold text-gray-400">{msg.author}: </span>
                                    <span className="text-gray-200">{msg.message}</span>
                                </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <input
                                type="text"
                                placeholder={accessGranted && currentUser ? "Dites quelque chose..." : "Connectez-vous pour chatter"}
                                disabled={!accessGranted || !currentUser}
                                className="w-full bg-brand-dark text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-red disabled:bg-gray-800 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isPaymentModalOpen && event.access.type === 'public' && (
                <PaymentModal
                    onClose={() => setIsPaymentModalOpen(false)}
                    onConfirm={handlePaymentConfirm}
                    title={`Accès à "${event.title}"`}
                    amount={event.access.cost}
                    description="Veuillez effectuer le paiement pour obtenir un accès immédiat à cette retransmission en direct."
                />
            )}
        </>
    );
};

export default LivePage;