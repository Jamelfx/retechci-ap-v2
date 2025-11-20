
import React from 'react';
import { Link } from 'react-router-dom';

const ContractTypesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
       <div className="text-sm breadcrumbs mb-4 text-gray-400">
        <ul>
            <li><Link to="/conventions" className="hover:text-white">Conventions</Link></li> 
            <li>Contrats Types</li>
        </ul>
      </div>

      <h1 className="text-4xl font-extrabold text-center mb-6">
        Modèles de Contrats
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
        Pour garantir des relations de travail claires et équitables, le RETECHCI met à la disposition de ses membres et des producteurs des modèles de contrats types (CDDU) adaptés aux réalités de notre secteur.
      </p>

      <div className="bg-brand-gray p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-brand-red mb-4">Prochainement disponible</h2>
        <p className="text-gray-300">
          Cette section est en cours de construction. Nous travaillons avec des experts juridiques pour vous fournir des documents fiables et complets.
          <br/>
          Revenez bientôt pour télécharger nos modèles de contrats.
        </p>
      </div>
    </div>
  );
};

export default ContractTypesPage;