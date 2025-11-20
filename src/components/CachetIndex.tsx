
import React, { useMemo, useState } from 'react';
import { Film, Technician, JobSalary } from '../types/types';
import { ROLE_WEIGHTS } from '../constants/constants';

// --- Helper Functions ---
export const calculateCachetScore = (filmography: Film[]): number => {
    if (!filmography || filmography.length === 0) return 0;
    return filmography.reduce((acc, film) => {
        const roleWeight = ROLE_WEIGHTS[film.role] || 1;
        const impact = film.impactScore || 1;
        return acc + (impact * roleWeight);
    }, 0);
};

interface CachetLevel {
    label: string;
    level: number; // 1 to 4
    minScore: number;
    color: string;
}

export const getCachetLevel = (score: number): CachetLevel => {
    if (score >= 75) return { label: 'Très Recherché', level: 4, minScore: 75, color: 'bg-red-500' };
    if (score >= 50) return { label: 'Profil Expert', level: 3, minScore: 50, color: 'bg-purple-500' };
    if (score >= 25) return { label: 'Expérimenté', level: 2, minScore: 25, color: 'bg-blue-500' };
    return { label: 'Confirmé', level: 1, minScore: 0, color: 'bg-green-500' };
};

const SPECIALTY_TO_JOB_TITLE_MAP: { [key: string]: string } = {
    'Directrice de la photographie': 'Directeur photo / Chef OPV',
    'Ingénieur du son': 'Chef OPS / Ingénieur du son',
    'Monteuse': 'Chef monteur',
    'Électricien de plateau': 'Chef électricien',
    'Scripte': 'Scripte',
    'Machiniste': 'Chef machiniste',
};

export const calculateCachetEstimation = (technician: Technician, salaries: JobSalary[]): number => {
    const jobTitle = SPECIALTY_TO_JOB_TITLE_MAP[technician.specialty];
    if (!jobTitle || !salaries || salaries.length === 0) return 0;

    const salaryInfo = salaries.find(job => job.jobTitle === jobTitle);
    // Use category B as a baseline for experience
    const baseWeeklyRate = salaryInfo?.categories.find(c => c.category === 'B')?.weeklyRate || 0;
    if (baseWeeklyRate === 0) return 0;

    const averageProjectWeeks = 4;
    const baseProjectSalary = baseWeeklyRate * averageProjectWeeks;

    const totalBoxOffice = technician.filmography.reduce((acc, film) => acc + (film.boxOffice || 0), 0);
    const totalAudience = technician.filmography.reduce((acc, film) => acc + (film.audience || 0), 0);
    
    // Simple reputation bonus calculation
    const boxOfficeBonus = totalBoxOffice / 200000; // Bonus factor for every 200k entries
    const audienceBonus = totalAudience / 1000000; // Bonus factor for every 1M viewers
    
    const reputationMultiplier = 1 + (boxOfficeBonus * 0.1) + (audienceBonus * 0.1);
    const finalMultiplier = Math.min(reputationMultiplier, 3.5); // Cap multiplier at 3.5x

    const estimatedCachet = baseProjectSalary * finalMultiplier;

    // Round to nearest 10000
    return Math.round(estimatedCachet / 10000) * 10000;
};


// --- Component ---
interface CachetIndexProps {
    technician: Technician;
    salaries: JobSalary[];
}

const CachetIndex: React.FC<CachetIndexProps> = ({ technician, salaries }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const score = useMemo(() => calculateCachetScore(technician.filmography), [technician.filmography]);
    const { label, level, color } = useMemo(() => getCachetLevel(score), [score]);
    const estimatedCachet = useMemo(() => calculateCachetEstimation(technician, salaries), [technician, salaries]);
    
    const progressPercentage = Math.min((level / 4) * 100, 100);

    return (
        <div className="bg-brand-dark p-4 rounded-lg">
            <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                <div className="flex items-center">
                    <h4 className="font-bold text-xl">Indice de Cachet</h4>
                    <div 
                        className="relative ml-2"
                        onMouseEnter={() => setIsTooltipVisible(true)}
                        onMouseLeave={() => setIsTooltipVisible(false)}
                    >
                        <svg className="w-5 h-5 text-gray-400 cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                        {isTooltipVisible && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-black text-white text-xs rounded py-1 px-2 z-10 text-center shadow-lg">
                                Ceci est une estimation non-contractuelle basée sur le salaire de base du poste et la notoriété des projets listés.
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`text-sm font-bold px-3 py-1 rounded-md ${color} text-white`}>{label}</span>
                     {estimatedCachet > 0 && (
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-px bg-gray-600"></div>
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.162-.218c.155.103.346.196.567.267zm.217-2.308a3.5 3.5 0 01-.217-3.328c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.162-.218c.155.103.346.196.567.267zM10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.831.666A1 1 0 008 7.418v1.162a1 1 0 00.169.544c.483.633.95.99 1.226 1.252a1 1 0 01.305.655v1.285a1 1 0 001 1h.5a1 1 0 001-1v-1.285a1 1 0 01.305-.655c.277-.262.744-.62 1.226-1.252a1 1 0 00.169-.544V7.418a1 1 0 00-.738-1.831A4.5 4.5 0 0011 5.092V5z" /></svg>
                            <span className="font-bold text-white text-lg">~ {estimatedCachet.toLocaleString('fr-FR')} FCFA</span>
                            <span className="text-gray-400 text-sm hidden sm:block">/ projet</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <div 
                    className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`} 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default CachetIndex;
