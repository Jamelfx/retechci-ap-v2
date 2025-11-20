
import React from 'react';
import Carousel from '../components/Carousel';

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-brand-gray p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-brand-red border-b-2 border-brand-red pb-2 mb-4">{title}</h2>
        <div className="text-gray-300 space-y-4 leading-relaxed">
            {children}
        </div>
    </div>
);

// Data for CA members
const caMembers = Array.from({ length: 13 }, (_, i) => ({
    name: `Membre du CA ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/ca${i + 1}/400/400`,
}));

// Data for BE members
const beRoles = [
    'Directeur Exécutif',
    'Secrétaire Général',
    'Secrétaire Général Adjoint',
    'Secrétaire à la communication',
    'Secrétaire à la communication Adjoint',
    'Trésorière',
    'Trésorier Adjoint'
];
const beMembers = Array.from({ length: 7 }, (_, i) => ({
    name: `Membre du BE ${i + 1}`,
    role: beRoles[i],
    imageUrl: `https://picsum.photos/seed/be${i + 1}/400/400`,
}));


const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10">
            Notre Organisation
        </h1>
        
        <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            Le Réseau des Techniciens du Cinéma de Côte d'Ivoire (RETECHCI) est structuré autour de trois organes principaux qui garantissent une gouvernance démocratique, transparente et efficace, au service de tous ses membres.
        </p>

        <InfoCard title="Le Conseil d'Administration (CA)">
            <div className="flex flex-col md:flex-row md:space-x-8 items-start">
                <div className="md:w-1/2 space-y-4">
                    <p>
                        Le Conseil d'Administration est l'organe de surveillance et d'orientation stratégique du RETECHCI. Composé de 13 membres élus respectés pour leur expérience et leur vision, le CA a pour mission de veiller à la bonne gestion de l'association et à la poursuite de ses objectifs à long terme.
                    </p>
                    <p>
                        Il se réunit périodiquement pour approuver les budgets, valider les grandes orientations proposées par le Bureau Exécutif et s'assurer que les actions menées sont conformes à la mission et aux valeurs du réseau.
                    </p>
                </div>
                <div className="md:w-1/2 w-full mt-6 md:mt-0">
                     <Carousel items={caMembers} />
                </div>
            </div>
        </InfoCard>

        <InfoCard title="Le Bureau Exécutif (BE)">
             <div className="flex flex-col md:flex-row md:space-x-8 items-start">
                <div className="md:w-1/2 space-y-4">
                    <p>
                        Véritable moteur de l'association, le Bureau Exécutif est l'organe de gestion quotidienne du RETECHCI. Composé de 7 membres, il est chargé de mettre en œuvre la stratégie définie par le Conseil d'Administration et validée par l'Assemblée Générale.
                    </p>
                    <p>
                        Ses membres animent la vie de l'association, organisent les événements, gèrent les partenariats, et représentent le RETECHCI auprès des institutions et du public. C'est l'interlocuteur privilégié des membres pour toutes les questions opérationnelles.
                    </p>
                </div>
                <div className="md:w-1/2 w-full mt-6 md:mt-0">
                    <Carousel items={beMembers} />
                </div>
            </div>
        </InfoCard>

        <InfoCard title="L'Assemblée Générale (AG)">
            <p>
                L'Assemblée Générale est l'organe souverain du RETECHCI. Elle rassemble l'ensemble des membres actifs de l'association et constitue le principal espace d'expression démocratique. C'est le lieu où les décisions les plus importantes sont débattues et votées.
            </p>
             <div className="my-6">
                <img 
                    src="https://picsum.photos/seed/assembly/800/400" 
                    alt="Assemblée Générale du RETECHCI"
                    className="rounded-lg shadow-md w-full object-cover"
                />
            </div>
            <p>
                Elle se réunit au moins une fois par an en session ordinaire pour :
            </p>
            <ul className="list-disc list-inside pl-4">
                <li>Approuver le rapport moral et financier de l'année écoulée.</li>
                <li>Voter le budget pour l'année à venir.</li>
                <li>Élire les membres du Conseil d'Administration et du Bureau Exécutif.</li>
                <li>Débattre et voter les modifications des statuts et du règlement intérieur.</li>
            </ul>
             <p>
                L'AG est le moment clé où chaque membre peut faire entendre sa voix et participer activement à la vie et à l'avenir de son réseau.
            </p>
        </InfoCard>
    </div>
  );
};

export default AboutPage;