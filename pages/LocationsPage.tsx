import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IVORY_COAST_DISTRICTS } from '../constants';
import { Location } from '../types';
import IvoryCoastMap from '../components/IvoryCoastMap';
import { AnimatePresence } from 'framer-motion';
import InterestModal from '../components/InterestModal';
import DirectoryNav from '../components/DirectoryNav';
import apiClient from '../api/client';

const LocationCard: React.FC<{ location: Location; onInterestClick: () => void; }> = ({ location, onInterestClick }) => (
  <div className="bg-brand-gray rounded-lg overflow-hidden shadow-lg flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
    <img className="w-full h-56 object-cover" src={location.imageUrl} alt={location.name} />
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-white">{location.name}</h3>
        <p className="text-brand-red text-sm mb-2">{IVORY_COAST_DISTRICTS[location.region]}</p>
        <p className="text-gray-400 text-sm mb-3">{location.description}</p>
        <div className="flex flex-wrap gap-2">
          {location.tags.map(tag => (
              <span key={tag} className="bg-brand-dark text-gray-300 text-xs font-medium px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
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

const LocationsPage: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [interestedItem, setInterestedItem] = useState<Location | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await apiClient.get('/api/locations');
                setLocations(data);
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredLocations = useMemo(() => {
        if (!selectedRegion) {
            return locations;
        }
        return locations.filter(loc => loc.region === selectedRegion);
    }, [selectedRegion, locations]);

    const selectedRegionName = selectedRegion ? IVORY_COAST_DISTRICTS[selectedRegion] : null;

    return (
        <div>
            <div className="text-sm breadcrumbs mb-4 text-gray-400">
                <ul>
                    <li><Link to="/technicians" className="hover:text-white">Annuaires</Link></li> 
                    <li>Lieux de Tournage</li>
                </ul>
            </div>
            
            <DirectoryNav />

            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold mb-4">Lieux de Tournage en Côte d'Ivoire</h1>
                <p className="text-gray-400 max-w-3xl mx-auto">
                    Explorez la diversité des paysages ivoiriens. Survolez et cliquez sur un district de la carte pour découvrir des lieux de tournage uniques.
                </p>
                 {selectedRegion && (
                    <button 
                        onClick={() => setSelectedRegion(null)}
                        className="mt-4 bg-brand-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-80 transition-colors"
                    >
                        Voir tous les lieux
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-1 bg-brand-gray p-4 rounded-lg shadow-lg flex items-center justify-center">
                    <IvoryCoastMap 
                        selectedRegion={selectedRegion}
                        onSelectRegion={setSelectedRegion}
                    />
                </div>
                <div className="lg:col-span-2">
                     <h2 className="text-2xl font-bold mb-4">
                        {selectedRegionName ? `Lieux - ${selectedRegionName}` : 'Tous les Lieux'}
                    </h2>
                    {isLoading && <p>Chargement des lieux...</p>}
                    {error && <p className="text-red-500">Erreur: {error}</p>}
                    {!isLoading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[600px] overflow-y-auto pr-4">
                            {filteredLocations.length > 0 ? (
                                filteredLocations.map(loc => (
                                <LocationCard key={loc.id} location={loc} onInterestClick={() => setInterestedItem(loc)} />
                            ))
                            ) : (
                                <p className="text-gray-500 col-span-2 text-center py-8">Aucun lieu trouvé pour ce district.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

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

export default LocationsPage;