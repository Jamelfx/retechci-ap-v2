import React, { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../api/client';

interface InterestModalProps {
    itemName: string;
    onClose: () => void;
}

const InterestModal: React.FC<InterestModalProps> = ({ itemName, onClose }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await apiClient.post('/api/messages', {
                senderName: formData.name,
                senderEmail: formData.email,
                subject: `Demande de contact pour: ${itemName}`,
                message: `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
            });
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-brand-gray rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                        <h2 className="text-2xl font-bold text-brand-red">Demande de Contact</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                    </div>

                    {submitted ? (
                        <div className="text-center py-8">
                            <h3 className="text-xl font-bold text-green-500 mb-2">Message Envoyé !</h3>
                            <p className="text-gray-300">Un administrateur du RETECHCI a bien reçu votre demande pour "<span className="font-semibold">{itemName}</span>" et vous contactera prochainement.</p>
                            <button onClick={onClose} className="mt-6 bg-brand-red text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors">
                                Fermer
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                             {error && <p className="text-red-500 text-sm text-center bg-red-900 bg-opacity-50 p-2 rounded-md">{error}</p>}
                            <p className="text-gray-300">Vous êtes intéressé par : <span className="font-bold text-white">{itemName}</span>.</p>
                            <p className="text-gray-400 text-sm">Veuillez remplir ce formulaire. Un administrateur facilitera la mise en contact.</p>
                            
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Votre Nom</label>
                                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange}
                                    className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Votre Email</label>
                                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange}
                                    className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Votre Message (optionnel)</label>
                                <textarea name="message" id="message" rows={3} value={formData.message} onChange={handleChange}
                                    placeholder="Ajoutez des détails sur votre projet ou vos questions..."
                                    className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red"></textarea>
                            </div>
                            <div>
                                <button type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-brand-red hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors">
                                    Contacter un administrateur
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default InterestModal;