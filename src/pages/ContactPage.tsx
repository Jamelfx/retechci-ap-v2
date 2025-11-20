
import React, { useState } from 'react';
import apiClient from '../api/client';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
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
                subject: formData.subject,
                message: formData.message,
            });
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de l\'envoi du message.');
        }
    };

  return (
    <div className="max-w-2xl mx-auto bg-brand-gray p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">Contactez-nous</h1>
        <p className="text-center text-gray-400 mb-8">Pour toute demande de collaboration ou d'information, veuillez remplir le formulaire ci-dessous.</p>
        
        {submitted && (
            <div className="bg-green-500 text-white p-4 rounded-md mb-6 text-center">
                Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
            </div>
        )}

        {error && (
            <div className="bg-red-500 text-white p-4 rounded-md mb-6 text-center">
                {error}
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300">Sujet</label>
                <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange}
                       className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                <textarea name="message" id="message" rows={5} required value={formData.message} onChange={handleChange}
                          className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red"></textarea>
            </div>
            <div>
                <button type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-brand-red hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors">
                    Envoyer le Message
                </button>
            </div>
        </form>
    </div>
  );
};

export default ContactPage;