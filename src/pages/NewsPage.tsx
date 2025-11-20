
import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types/types';
import apiClient from '../api/client';

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div className="bg-brand-gray rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row mb-8 transform hover:-translate-y-1 transition-transform duration-300">
        <img className="w-full md:w-1/3 h-64 md:h-auto object-cover" src={article.imageUrl} alt={article.title} />
        <div className="p-6 flex flex-col justify-between">
            <div>
                <p className="text-sm text-gray-400 mb-2">{new Date(article.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h3 className="text-2xl font-bold text-brand-red mb-3">{article.title}</h3>
                <p className="text-gray-300 leading-relaxed">{article.summary}</p>
            </div>
            <div className="mt-4">
                 <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-red font-semibold hover:underline">
                    Lire la suite &rarr;
                </a>
            </div>
        </div>
    </div>
);

const NewsPage: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setIsLoading(true);
                const data: NewsArticle[] = await apiClient.get('/api/news');
                setNews(data);
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10">
            Actualités de l'Association
        </h1>
        
        {isLoading && <div className="text-center py-16 text-gray-400 text-2xl">Chargement des actualités...</div>}
        {error && <div className="text-center py-16 text-red-500 text-2xl">Erreur : {error}</div>}

        {!isLoading && !error && (
            <div className="space-y-12">
                {news.map(article => (
                    <NewsCard key={article.id} article={article} />
                ))}
            </div>
        )}
    </div>
  );
};

export default NewsPage;