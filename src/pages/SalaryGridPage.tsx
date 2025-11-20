
import React, { useState, useEffect } from 'react';
import { JobSalary } from '../types/types';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

const ConditionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-brand-dark p-4 rounded-lg h-full">
        <h3 className="font-bold text-brand-red mb-2">{title}</h3>
        <div className="text-gray-400 text-sm space-y-2">
            {children}
        </div>
    </div>
);


const SalaryGridPage: React.FC = () => {
  const [salaries, setSalaries] = useState<JobSalary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await apiClient.get('/api/salaries');
            setSalaries(data);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue.');
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);
  
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('fr-FR')} FCFA`;
  };

  const categoryHeaders = salaries[0]?.categories || [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-sm breadcrumbs mb-4 text-gray-400">
        <ul>
            <li><Link to="/conventions" className="hover:text-white">Conventions</Link></li> 
            <li>Grille Salariale</li>
        </ul>
      </div>

      <h1 className="text-4xl font-extrabold text-center mb-4">Grille Salariale Recommandée</h1>
      <p className="text-center text-gray-400 mb-10 max-w-3xl mx-auto">
        Voici la grille des Salaires Minimums Techniciens (SMT) établie par le RETECHCI. Ces tarifs sont calculés sur une base hebdomadaire de <strong>44 heures de travail effectif</strong>. Ils représentent des minimums recommandés et peuvent être négociés à la hausse en fonction de l'ampleur du projet et de l'expérience du technicien.
      </p>

      {isLoading && <div className="text-center py-16 text-gray-400 text-2xl">Chargement de la grille...</div>}
      {error && <div className="text-center py-16 text-red-500 text-2xl">Erreur : {error}</div>}

      {!isLoading && !error && salaries.length > 0 && (
          <div className="bg-brand-gray p-4 sm:p-6 rounded-lg shadow-xl overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b-2 border-brand-red">
                  <th className="p-4 text-lg font-bold">Poste</th>
                  {categoryHeaders.map(cat => (
                    <th key={cat.category} className="p-4 text-lg font-bold text-center">
                        <div>Catégorie {cat.category}</div>
                        <div className="text-sm font-normal text-gray-400">{cat.description}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salaries.map((job, index) => (
                  <tr key={job.id} className={`border-b border-gray-800 ${index % 2 === 0 ? 'bg-brand-dark' : 'bg-opacity-50'}`}>
                    <td className="p-4 font-semibold text-white">{job.jobTitle}</td>
                    {job.categories.map(cat => (
                      <td key={cat.category} className="p-4 text-center text-gray-300 whitespace-nowrap">
                        {formatCurrency(cat.weeklyRate)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}
      
       <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">Conditions et Majorations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ConditionCard title="Heures Supplémentaires">
                  <p>La base hebdomadaire est de <strong>44 heures</strong>.</p>
                  <p>Les heures effectuées au-delà sont majorées :</p>
                  <ul className="list-disc list-inside pl-2">
                      <li><strong>+25%</strong> de la 45ème à la 48ème heure.</li>
                      <li><strong>+50%</strong> au-delà de la 48ème heure.</li>
                  </ul>
              </ConditionCard>
              <ConditionCard title="Travail de Nuit">
                  <p>Toute heure de travail effectuée entre <strong>22h00 et 06h00</strong> est considérée comme travail de nuit.</p>
                  <p>Elle donne lieu à une majoration de <strong>+50%</strong> du salaire horaire de base.</p>
              </ConditionCard>
              <ConditionCard title="Jours Fériés & Repos Hebdomadaire">
                  <p>Le travail un jour férié ou durant le jour de repos hebdomadaire (généralement le dimanche) est majoré de <strong>+100%</strong> (salaire doublé).</p>
              </ConditionCard>
              <ConditionCard title="Indemnités & Défraiements">
                  <p>Les salaires indiqués s'entendent hors défraiements.</p>
                  <p>Les frais de transport, de restauration et d'hébergement (si tournage hors résidence) sont à la charge de la production.</p>
              </ConditionCard>
              <ConditionCard title="Type d'Engagement">
                   <p>Ces tarifs s'appliquent dans le cadre d'un Contrat de Travail à Durée Déterminée d'Usage (CDDU), conformément aux pratiques du secteur audiovisuel.</p>
              </ConditionCard>
               <ConditionCard title="Définition de l'Expérience">
                   <p>La classification (A, B, C) est déterminée par le nombre d'années d'expérience pertinente, la filmographie et les qualifications spécifiques du technicien.</p>
              </ConditionCard>
          </div>
      </div>

       <p className="text-center text-gray-500 mt-8 text-sm">
        Cette grille est indicative et sujette à révision par le Bureau Exécutif. Pour toute question, veuillez nous contacter.
      </p>
    </div>
  );
};

export default SalaryGridPage;