
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Prop } from '../types/types';
import { AnimatePresence } from 'framer-motion';
import InterestModal from '../components/InterestModal';
import DirectoryNav from '../components/DirectoryNav';
import apiClient from '../api/client';

const ShowcaseCard: React.FC<{ item: Prop; onInterestClick: () => void; }> = ({ item, onInterestClick }) => (
  <div className="bg-brand-gray rounded-lg overflow-hidden shadow-lg flex flex-col transform hover:-translate-y-1 transition-transform duration-300 group">
    <div className="relative overflow-hidden">
        <img className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105" src={item.imageUrl} alt={item.name} />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-white truncate">{item.name}</h3>
        <p className="text-brand-red text-sm mb-2">{item.category}</p>
        <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
        <p className="text-gray-500 text-xs mt-2">Fournisseur: {item.creator}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
          <button 
              onClick={onInterestClick}
              className="w-full bg-brand-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-80 transition-colors"
          >
              Ça m'intéresse
          </button>
      </div>
    </div>
  </div>
);


const PropsPage: React.FC = () => {
    const [items, setItems] = useState<Prop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [interestedItem, setInterestedItem] = useState<Prop | null>(null);
    
     useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await apiClient.get('/api/props');
                setItems(data);
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const categories = useMemo(() => ['all', ...Array.from(new Set(items.map(c => c.category)))], [items]);
    
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, items]);

    return (
        <div>
            <div className="text-sm breadcrumbs mb-4 text-gray-400">
                <ul>
                    <li><Link to="/technicians" className="hover:text-white">Annuaires</Link></li> 
                    <li>Accessoires</li>
                </ul>
            </div>

            <DirectoryNav />

            <div className="bg-brand-gray p-6 rounded-lg mb-8 shadow-lg">
                <h1 className="text-3xl font-bold mb-4 text-center">Annuaire des Accessoires</h1>
                <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Rechercher par nom ou description..."
                    className="w-full md:w-1/2 p-3 bg-brand-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="w-full md:w-1/2 p-3 bg-brand-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'Toutes les catégories' : cat}</option>
                    ))}
                </select>
                </div>
            </div>
            
            {isLoading && <div className="text-center py-16 text-gray-400 text-2xl">Chargement...</div>}
            {error && <div className="text-center py-16 text-red-500 text-2xl">Erreur : {error}</div>}

            {!isLoading && !error && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredItems.map(item => (
                            <ShowcaseCard key={item.id} item={item} onInterestClick={() => setInterestedItem(item)} />
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            <p className="text-2xl">Aucun accessoire trouvé.</p>
                            <p>Essayez d'ajuster vos critères de recherche.</p>
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {interestedItem && (
                    <InterestModal 
                        itemName={interestedItem.name} 
                        onClose={() => setInterestedItem(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PropsPage;