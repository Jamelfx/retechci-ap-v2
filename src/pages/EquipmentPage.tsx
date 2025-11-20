
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RentalCompany } from '../types/types';
import { motion, AnimatePresence } from 'framer-motion';
import InterestModal from '../components/InterestModal';
import DirectoryNav from '../components/DirectoryNav';
import apiClient from '../api/client';

interface CompanyCardProps {
    company: RentalCompany;
    onInterestClick: (equipmentName: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onInterestClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const formatCurrency = (value: number) => `${value.toLocaleString('fr-FR')} FCFA/jour`;

    return (
        <div className="bg-brand-gray rounded-lg shadow-lg overflow-hidden">
            <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center space-x-4">
                    <img src={company.logoUrl} alt={`${company.name} logo`} className="w-16 h-16 rounded-full object-cover bg-white"/>
                    <div>
                        <h3 className="text-2xl font-bold text-white">{company.name}</h3>
                        <p className="text-gray-400 text-sm">{company.contact}</p>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </motion.div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="bg-brand-dark p-6">
                            <h4 className="font-bold text-brand-red mb-4">Matériel Disponible :</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="p-2 font-semibold text-gray-400">Équipement</th>
                                            <th className="p-2 font-semibold text-gray-400">Catégorie</th>
                                            <th className="p-2 font-semibold text-gray-400 text-right">Tarif Journalier</th>
                                            <th className="p-2 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {company.equipment.map(item => (
                                            <tr key={item.id} className="border-b border-gray-800">
                                                <td className="p-2 text-white">{item.name}</td>
                                                <td className="p-2 text-gray-300">{item.category}</td>
                                                <td className="p-2 text-right text-gray-300">{formatCurrency(item.dailyRate)}</td>
                                                <td className="p-2 text-right">
                                                    <button 
                                                        onClick={() => onInterestClick(item.name)}
                                                        className="bg-brand-red text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-opacity-80 transition-colors"
                                                    >
                                                        Intéressé(e)
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface InterestedItem {
    itemName: string;
    companyName: string;
}

const EquipmentPage: React.FC = () => {
    const [companies, setCompanies] = useState<RentalCompany[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [interestedItem, setInterestedItem] = useState<InterestedItem | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await apiClient.get('/api/equipment');
                setCompanies(data);
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="text-sm breadcrumbs mb-4 text-gray-400">
                <ul>
                    <li><Link to="/technicians" className="hover:text-white">Annuaires</Link></li> 
                    <li>Location de Matériel</li>
                </ul>
            </div>

            <DirectoryNav />

            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold mb-4">Loueurs de Matériel Cinématographique</h1>
                <p className="text-gray-400 max-w-3xl mx-auto">
                    Trouvez le matériel adéquat pour votre production auprès de nos partenaires de confiance. Cliquez sur une société pour voir son catalogue.
                </p>
            </div>
            
            {isLoading && <div className="text-center py-16 text-gray-400 text-2xl">Chargement...</div>}
            {error && <div className="text-center py-16 text-red-500 text-2xl">Erreur : {error}</div>}
            
            {!isLoading && !error && (
                <div className="space-y-6 max-w-4xl mx-auto">
                    {companies.map(company => (
                        <CompanyCard 
                            key={company.id} 
                            company={company}
                            onInterestClick={(itemName) => setInterestedItem({ itemName, companyName: company.name })}
                        />
                    ))}
                </div>
            )}


            <AnimatePresence>
                {interestedItem && (
                    <InterestModal 
                        itemName={`${interestedItem.itemName} (chez ${interestedItem.companyName})`}
                        onClose={() => setInterestedItem(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default EquipmentPage;