
import React from 'react';
import { Link } from 'react-router-dom';

const ConventionCard: React.FC<{ to: string; title: string; description: string, icon: React.ReactNode }> = ({ to, title, description, icon }) => (
    <Link to={to} className="bg-brand-gray p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-start space-x-4">
        <div className="flex-shrink-0 text-brand-red">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    </Link>
);


const ConventionsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-6">
        Conventions & Chartes
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
        Le RETECHCI s'engage à professionnaliser le secteur en établissant des standards. Découvrez nos conventions collectives, grilles salariales et chartes éthiques.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ConventionCard
          to="/conventions/grille-salariale"
          title="Grille Salariale"
          description="Consultez les salaires minimums recommandés pour chaque poste technique, garantissant une rémunération équitable."
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          }
        />
        <ConventionCard
          to="/conventions/contrats-types"
          title="Contrats Types"
          description="Accédez à des modèles de contrats de travail (CDDU) pour sécuriser vos engagements professionnels."
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          }
        />
        <ConventionCard
          to="/conventions/charte-image"
          title="Charte de l'Image"
          description="Découvrez nos engagements pour un environnement de travail respectueux, éthique et sécurisé sur les plateaux."
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          }
        />
      </div>
    </div>
  );
};

export default ConventionsPage;