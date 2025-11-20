
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DirectoryCard: React.FC<{ to: string; title: string; description: string, icon: React.ReactNode }> = ({ to, title, description, icon }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <Link to={to} className="bg-brand-gray p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center h-full">
            <div className="flex-shrink-0 text-brand-red mb-4">
                {icon}
            </div>
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
            <div className="mt-4 text-brand-red font-semibold">
                Consulter &rarr;
            </div>
        </Link>
    </motion.div>
);

const TechniciansPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-6">
        Nos Annuaires
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
        Explorez nos ressources pour trouver les talents, les lieux, et le matériel dont vous avez besoin pour vos productions en Côte d'Ivoire.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DirectoryCard
          to="/directory/technicians"
          title="Techniciens"
          description="Trouvez les professionnels qualifiés pour chaque poste technique, du réalisateur au machiniste."
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          }
        />
        <DirectoryCard
          to="/directory/locations"
          title="Lieux de Tournage"
          description="Découvrez des décors uniques, des paysages urbains aux trésors naturels de la Côte d'Ivoire."
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          }
        />
        <DirectoryCard
          to="/directory/costumes"
          title="Costumes"
          description="Une collection de costumes traditionnels, modernes et historiques créés par nos membres talentueux."
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> // Placeholder Icon
          }
        />
        <DirectoryCard
          to="/directory/props"
          title="Accessoires"
          description="Trouvez des accessoires uniques, des objets d'art traditionnels aux véhicules d'époque."
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          }
        />
        <DirectoryCard
          to="/directory/equipment"
          title="Location de Matériel"
          description="Consultez la liste de nos partenaires pour la location de caméras, lumières, son et machinerie."
          icon={
             <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          }
        />
      </div>
    </div>
  );
};

export default TechniciansPage;