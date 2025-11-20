
import React from 'react';
import { Link } from 'react-router-dom';

const ImageCharterPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-sm breadcrumbs mb-4 text-gray-400">
            <ul>
                <li><Link to="/conventions" className="hover:text-white">Conventions</Link></li> 
                <li>Charte de l'Image</li>
            </ul>
        </div>
        <h1 className="text-4xl font-extrabold text-center mb-6">
            Charte de l'Image du RETECHCI
        </h1>
        <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            La Charte de l'Image est un engagement collectif pour promouvoir un environnement de travail respectueux, éthique et sécurisé pour tous les professionnels sur un plateau de tournage.
        </p>

        <div className="bg-brand-gray p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-brand-red mb-4">Contenu à venir</h2>
            <p className="text-gray-300">
                La charte est en phase finale de rédaction par un comité dédié. Elle abordera des sujets essentiels tels que le respect mutuel, la prévention des harcèlements, la diversité et l'inclusion.
                <br />
                Le document officiel sera publié ici très prochainement.
            </p>
        </div>
    </div>
  );
};

export default ImageCharterPage;