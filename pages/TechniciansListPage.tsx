import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Technician, Availability, Film, JobSalary } from '../types';
import DirectoryNav from '../components/DirectoryNav';
import InterestModal from '../components/InterestModal';
import CachetIndex, { calculateCachetScore, getCachetLevel } from '../components/CachetIndex';
import { AnimatePresence } from 'framer-motion';
import apiClient from '../api/client';

const AvailabilityIndicator: React.FC<{ availability: Availability; showText?: boolean }> = ({ availability, showText = false }) => {
  const baseClasses = "h-4 w-4 rounded-full inline-block";
  let colorClass = '';
  switch (availability) {
    case Availability.AVAILABLE:
      colorClass = 'bg-green-500';
      break;
    case Availability.SOON:
      colorClass = 'bg-yellow-500';
      break;
    case Availability.UNAVAILABLE:
      colorClass = 'bg-red-500';
      break;
  }
  return (
    <div className="flex items-center">
      <span className={`${baseClasses} ${colorClass}`} title={availability}></span>
      {showText && <span className="ml-2 text-gray-300">{availability}</span>}
    </div>
  );
};

const ImpactStars: React.FC<{ score: number }> = ({ score }) => (
    <div className="flex items-center flex-shrink-0 ml-4" title={`Impact: ${score}/5`}>
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < score ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const FilmographyItem: React.FC<{film: Film}> = ({ film }) => (
    <li className="bg-brand-dark p-3 rounded-md">
        <div className="flex justify-between items-start">
            <div>
                <span className="font-semibold text-white">{film.title}</span>
                <span className="text-gray-400"> ({film.month.toString().padStart(2, '0')}/{film.year})</span>
                <p className="text-sm text-gray-500">{film.role} - <span className="font-medium text-gray-400">{film.type}</span></p>
            </div>
            <ImpactStars score={film.impactScore} />
        </div>
        {(film.boxOffice || film.audience) && (
            <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-700 flex items-center space-x-1">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                <span className="font-medium">
                    {film.boxOffice && `${film.boxOffice.toLocaleString('fr-FR')} entrées`}
                    {film.audience && `${film.audience.toLocaleString('fr-FR')} spectateurs`}
                </span>
            </div>
        )}
    </li>
);


const TechnicianCard: React.FC<{ technician: Technician; onClick: () => void; }> = ({ technician, onClick }) => {
    const score = calculateCachetScore(technician.filmography);
    const { label } = getCachetLevel(score);

    return (
      <div 
        className="bg-brand-gray rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
        onClick={onClick}
      >
        <img className="w-full h-64 object-cover" src={technician.avatarUrl} alt={technician.name} />
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-white">{technician.name}</h3>
          <p className="text-brand-red mb-2">{technician.specialty}</p>
          <div className="text-xs font-semibold py-1 px-2 bg-gray-700 text-gray-300 rounded-full self-start">
              {label}
          </div>
          <div className="flex-grow"></div>
          <div className="mt-4 flex justify-end">
            <AvailabilityIndicator availability={technician.availability} />
          </div>
        </div>
      </div>
    );
};

const ProfileModal: React.FC<{ technician: Technician | null; onClose: () => void; onContactClick: () => void; salaries: JobSalary[] }> = ({ technician, onClose, onContactClick, salaries }) => {
    if (!technician) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-gray rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-brand-red">{technician.name}</h2>
                            <p className="text-lg text-gray-300">{technician.specialty}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8 mb-6">
                        <div className="flex-shrink-0 text-center">
                            <img src={technician.avatarUrl} alt={technician.name} className="w-40 h-40 rounded-full object-cover border-4 border-brand-red mx-auto"/>
                             <div className="mt-4">
                                <AvailabilityIndicator availability={technician.availability} showText={true} />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-bold text-xl mb-2">Biographie</h4>
                            <p className="text-gray-400 mb-4">{technician.bio}</p>

                            <h4 className="font-bold text-xl mb-2">Compétences</h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {technician.skills && technician.skills.length > 0 ? (
                                    technician.skills.map((skill, index) => (
                                        <span key={index} className="bg-brand-dark text-brand-red text-sm font-medium px-3 py-1 rounded-full">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">Aucune compétence renseignée.</p>
                                )}
                            </div>

                             <div className="mt-6">
                                <button 
                                    onClick={onContactClick}
                                    className="w-full bg-brand-red text-white px-4 py-2 rounded-md font-medium hover:bg-opacity-80 transition-colors"
                                >
                                    Contacter ce technicien
                                </button>
                            </div>
                        </div>
                    </div>

                     <div className="mb-6">
                        <CachetIndex technician={technician} salaries={salaries} />
                    </div>

                    <div>
                        <h4 className="font-bold text-xl mb-4">Filmographie</h4>
                        <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                            {technician.filmography.map((film, index) => (
                                <FilmographyItem key={index} film={film} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};


const TechniciansListPage: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [salaries, setSalaries] = useState<JobSalary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [techData, salaryData] = await Promise.all([
                apiClient.get('/api/technicians'),
                apiClient.get('/api/salaries'),
            ]);
            setTechnicians(techData);
            setSalaries(salaryData);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue.');
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);


  const specialties = useMemo(() => ['all', ...Array.from(new Set(technicians.map(t => t.specialty)))], [technicians]);
  
  const filteredTechnicians = useMemo(() => {
    return technicians.filter(tech => {
      const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'all' || tech.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [searchTerm, selectedSpecialty, technicians]);

  return (
    <div>
        <div className="text-sm breadcrumbs mb-4 text-gray-400">
            <ul>
                <li><Link to="/technicians" className="hover:text-white">Annuaires</Link></li> 
                <li>Techniciens</li>
            </ul>
        </div>
        
        <DirectoryNav />

        <div className="bg-brand-gray p-6 rounded-lg mb-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-center">Annuaire des Techniciens</h1>
            <div className="flex flex-col md:flex-row gap-4">
            <input
                type="text"
                placeholder="Rechercher par nom..."
                className="w-full md:w-1/2 p-3 bg-brand-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
                className="w-full md:w-1/2 p-3 bg-brand-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
                {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec === 'all' ? 'Toutes les spécialités' : spec}</option>
                ))}
            </select>
            </div>
        </div>

        {isLoading && <div className="text-center py-16 text-gray-400 text-2xl">Chargement des techniciens...</div>}
        {error && <div className="text-center py-16 text-red-500 text-2xl">Erreur : {error}</div>}

        {!isLoading && !error && (
             <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredTechnicians.map(tech => (
                        <TechnicianCard key={tech.id} technician={tech} onClick={() => setSelectedTechnician(tech)} />
                    ))}
                </div>

                {filteredTechnicians.length === 0 && (
                    <div className="text-center py-16 text-gray-500">
                        <p className="text-2xl">Aucun technicien trouvé.</p>
                        <p>Essayez d'ajuster vos critères de recherche.</p>
                    </div>
                )}
            </>
        )}


        <AnimatePresence>
            {selectedTechnician && (
                <ProfileModal 
                    technician={selectedTechnician} 
                    onClose={() => setSelectedTechnician(null)}
                    onContactClick={() => setIsContactModalOpen(true)}
                    salaries={salaries}
                />
            )}
        </AnimatePresence>

        <AnimatePresence>
            {isContactModalOpen && selectedTechnician && (
                <InterestModal 
                    itemName={`Demande de contact pour ${selectedTechnician.name}`} 
                    onClose={() => {
                        setIsContactModalOpen(false);
                    }} 
                />
            )}
        </AnimatePresence>
    </div>
  );
};

export default TechniciansListPage;