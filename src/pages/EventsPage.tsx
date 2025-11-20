
import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { AppEvent } from '../types/types';
import { motion } from 'framer-motion';

const EventCard: React.FC<{ event: AppEvent }> = ({ event }) => {
    const getIcon = (type: AppEvent['type']) => {
        switch(type) {
            case 'Festival': return '🎬';
            case 'Formation': return '🎓';
            case 'Réunion': return '🤝';
            default: return '📅';
        }
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-brand-gray rounded-lg overflow-hidden shadow-lg border-l-4 border-brand-red flex flex-col md:flex-row"
        >
            <div className="bg-brand-dark p-6 flex flex-col items-center justify-center min-w-[120px] text-center">
                <span className="text-3xl">{getIcon(event.type)}</span>
                <span className="text-brand-red font-bold mt-2">{new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                <span className="text-gray-400 text-sm">{new Date(event.date).getFullYear()}</span>
            </div>
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{event.type}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {event.location}
                </p>
                <p className="text-gray-300">{event.description}</p>
            </div>
        </motion.div>
    );
};

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await apiClient.get('/api/events');
                // Sort by date
                const sorted = data.sort((a: AppEvent, b: AppEvent) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setEvents(sorted);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-2">Agenda du RETECHCI</h1>
            <p className="text-center text-gray-400 mb-10">Ne manquez aucun événement important de la communauté.</p>

            {loading ? (
                <div className="text-center py-10">Chargement...</div>
            ) : (
                <div className="space-y-6">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                    {events.length === 0 && <div className="text-center text-gray-500">Aucun événement prévu pour le moment.</div>}
                </div>
            )}
        </div>
    );
};

export default EventsPage;
