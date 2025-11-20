
import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { ForumTopic, Member } from '../types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ForumPageProps {
    currentUser: Member | null;
}

const TopicCard: React.FC<{ topic: ForumTopic }> = ({ topic }) => (
    <div className="bg-brand-gray p-4 rounded-lg shadow mb-4 hover:bg-gray-800 transition-colors cursor-pointer">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
                <img src={topic.authorAvatar || `https://ui-avatars.com/api/?name=${topic.authorName}&background=random`} alt={topic.authorName} className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${topic.category === 'Annonces' ? 'bg-yellow-500 text-black' : 'bg-blue-900 text-blue-200'}`}>
                        {topic.category}
                    </span>
                </div>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{topic.content}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Par {topic.authorName} • {new Date(topic.date).toLocaleDateString()}</span>
                    <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        {topic.repliesCount} réponses
                    </span>
                </div>
            </div>
        </div>
    </div>
);

const CreateTopicModal: React.FC<{ onClose: () => void; onCreated: (topic: ForumTopic) => void; currentUser: Member }> = ({ onClose, onCreated, currentUser }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Divers');
    const [content, setContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newTopicData = {
                title,
                category,
                content,
                authorName: currentUser.name,
                authorAvatar: currentUser.avatarUrl
            };
            const created = await apiClient.post('/api/forum/topics', newTopicData);
            // API returns list, but in mock we can assume success or refetch. Mock returns updated list.
            onCreated(created[0]); 
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
             <div className="bg-brand-gray rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Nouveau Sujet</h2>
                    
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Titre</label>
                        <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-brand-dark rounded p-2 text-white border border-gray-600 focus:border-brand-red outline-none" />
                    </div>
                    
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Catégorie</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-brand-dark rounded p-2 text-white border border-gray-600 focus:border-brand-red outline-none">
                            <option value="Technique">Technique</option>
                            <option value="Matériel">Matériel</option>
                            <option value="Juridique">Juridique</option>
                            <option value="Annonces">Annonces</option>
                            <option value="Divers">Divers</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Message</label>
                        <textarea required rows={5} value={content} onChange={e => setContent(e.target.value)} className="w-full bg-brand-dark rounded p-2 text-white border border-gray-600 focus:border-brand-red outline-none"></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white">Annuler</button>
                        <button type="submit" className="bg-brand-red text-white px-6 py-2 rounded font-bold hover:bg-opacity-90">Publier</button>
                    </div>
                </form>
             </div>
        </div>
    );
}

const ForumPage: React.FC<ForumPageProps> = ({ currentUser }) => {
    const [topics, setTopics] = useState<ForumTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTopics = async () => {
        try {
            setLoading(true);
            const data = await apiClient.get('/api/forum/topics');
            setTopics(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    if (!currentUser) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Espace Communautaire</h2>
                <p className="text-gray-400 mb-6">Le forum est réservé aux membres connectés.</p>
                <Link to="/login" className="bg-brand-red text-white px-6 py-3 rounded font-bold hover:bg-opacity-80">Se connecter</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Forum des Membres</h1>
                    <p className="text-gray-400">Échangez, partagez et entraidez-vous.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-brand-red text-white px-4 py-2 rounded flex items-center font-bold hover:bg-opacity-90">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Nouveau Sujet
                </button>
            </div>

            {loading ? <div className="text-center">Chargement...</div> : (
                <div className="space-y-2">
                    {topics.map(topic => (
                        <TopicCard key={topic.id} topic={topic} />
                    ))}
                     {topics.length === 0 && <div className="text-center text-gray-500 py-10">Aucune discussion pour le moment. Lancez-en une !</div>}
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <CreateTopicModal 
                        currentUser={currentUser} 
                        onClose={() => setIsModalOpen(false)} 
                        onCreated={(newTopic) => {
                            fetchTopics(); // Refresh list
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ForumPage;
