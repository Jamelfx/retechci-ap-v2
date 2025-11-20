
import React, { useState, useMemo, useEffect } from 'react';
import { Member, Availability, Film, Photo, FinancialYearData, MemberStatus, UserRole } from '../types';
import PaymentModal from '../components/PaymentModal';
import FinancialChart from '../components/FinancialChart';
import { EXECUTIVE_ROLES } from '../constants';
import InterestModal from '../components/InterestModal';
import apiClient from '../api/client';

interface DashboardPageProps {
  member: Member;
  onMemberUpdate: (member: Member) => void;
}

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => (
    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-600 text-white">
        {role}
    </span>
);

const StatusBadge: React.FC<{ status: MemberStatus }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    let colorClasses = '';

    switch (status) {
        case 'Membre Actif':
            colorClasses = 'bg-green-200 text-green-800';
            break;
        case 'Membre d\'Honneur':
            colorClasses = 'bg-blue-200 text-blue-800';
            break;
        case 'Membre Bienfaiteur':
            colorClasses = 'bg-yellow-200 text-yellow-800';
            break;
        case 'Sanctionné':
            colorClasses = 'bg-red-200 text-red-800';
            break;
        default:
            colorClasses = 'bg-gray-200 text-gray-800';
    }
    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};


const DashboardCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-brand-gray p-6 rounded-lg shadow-lg flex flex-col ${className}`}>
        <h2 className="text-xl font-bold text-brand-red border-b-2 border-brand-red pb-2 mb-4">{title}</h2>
        <div className="flex-grow">
            {children}
        </div>
    </div>
);

const TwoFactorAuthModal: React.FC<{ onClose: () => void; onConfirm: () => void; }> = ({ onClose, onConfirm }) => {
    const [code, setCode] = useState('');

    const handleConfirm = () => {
        if (code.length === 6) {
            onConfirm();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-gray rounded-lg shadow-xl w-11/12 max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                     <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                        <h2 className="text-2xl font-bold text-brand-red">Activer 2FA</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    <div className="text-center space-y-4">
                        <p className="text-gray-300">Scannez ce QR Code avec votre application d'authentification (Google Authenticator, Authy, etc.).</p>
                        <div className="bg-white p-4 inline-block rounded-md">
                            {/* Placeholder for QR Code */}
                            <svg className="w-40 h-40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="100" fill="#E5E7EB"/>
                                <text x="50" y="55" textAnchor="middle" fontSize="10" fill="#374151">QR Code Simulé</text>
                            </svg>
                        </div>
                        <p className="text-gray-400 text-sm">Puis entrez le code à 6 chiffres généré par l'application pour finaliser la configuration.</p>
                        <div>
                             <label htmlFor="2fa-code" className="sr-only">Code de vérification</label>
                            <input 
                                id="2fa-code"
                                type="text" 
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                placeholder="_ _ _ _ _ _"
                                className="w-full max-w-xs bg-brand-dark text-white text-center text-2xl tracking-[1.5em] border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red"
                            />
                        </div>
                        <button 
                            onClick={handleConfirm}
                            disabled={code.length !== 6}
                            className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            Activer et Confirmer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardPage: React.FC<DashboardPageProps> = ({ member, onMemberUpdate }) => {
    const [isCotisationPaymentModalOpen, setIsCotisationPaymentModalOpen] = useState(false);
    const [isCvPaymentModalOpen, setIsCvPaymentModalOpen] = useState(false);
    const [showCotisationSuccessMessage, setShowCotisationSuccessMessage] = useState(false);
    const [showCvSuccessMessage, setShowCvSuccessMessage] = useState(false);
    const [contactingMember, setContactingMember] = useState<Member | null>(null);
    const [passwordData, setPasswordData] = useState({ old: '', new1: '', new2: '' });
    const [passwordMessage, setPasswordMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [allMembers, setAllMembers] = useState<Member[]>([]);
    const [financialData, setFinancialData] = useState<FinancialYearData[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [membersData, transactionsData] = await Promise.all([
                    apiClient.get('/api/technicians'),
                    apiClient.get('/api/admin/transactions') // Assuming this route exists
                ]);
                setAllMembers(membersData);

                const yearlyData: { [year: number]: FinancialYearData } = {};
                transactionsData.forEach((transaction: any) => {
                    const year = new Date(transaction.date).getFullYear();
                    if (!yearlyData[year]) {
                        yearlyData[year] = { year, recettes: 0, dépenses: 0 };
                    }
                    if (transaction.type === 'recette') {
                        yearlyData[year].recettes += transaction.amount;
                    } else {
                        yearlyData[year].dépenses += Math.abs(transaction.amount);
                    }
                });
                setFinancialData(Object.values(yearlyData).sort((a, b) => b.year - a.year));

            } catch (error) {
                console.error("Erreur lors de la récupération des données pour le tableau de bord:", error);
            }
        };
        fetchData();
    }, []);


    const initialNewFilmState: Film = {
        title: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        role: '',
        type: 'Long Métrage',
        impactScore: 3,
        boxOffice: undefined,
        audience: undefined,
    };

    const [newFilm, setNewFilm] = useState<Film>(initialNewFilmState);
    
    const latestPayment = member.paymentHistory.sort((a,b) => b.year - a.year)[0];
    const isPaymentDue = latestPayment && latestPayment.status === 'Impayée';
    
    const isExecutiveMember = useMemo(() => member.role && EXECUTIVE_ROLES.includes(member.role), [member.role]);
    
    const bureauMembers = useMemo(() => {
        return allMembers.filter(
            (m): m is Member => !!m.role && EXECUTIVE_ROLES.includes(m.role)
        ).sort((a, b) => EXECUTIVE_ROLES.indexOf(a.role!) - EXECUTIVE_ROLES.indexOf(b.role!));
    }, [allMembers]);


    const handleAvailabilityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAvailability = e.target.value as Availability;
        try {
            const updatedUser = await apiClient.put(`/api/users/${member.id}/availability`, { availability: newAvailability });
            onMemberUpdate(updatedUser);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la disponibilité:", error);
            // Optionally show an error message to the user
        }
    };

    const handleAddFilm = async () => {
        if (newFilm.title.trim() && newFilm.role.trim()) {
            const filmToAdd: Film = { ...newFilm };
            if(filmToAdd.type !== 'Long Métrage') filmToAdd.boxOffice = undefined;
            if(filmToAdd.type !== 'Série TV') filmToAdd.audience = undefined;

            try {
                const updatedUser = await apiClient.post(`/api/users/${member.id}/filmography`, { film: filmToAdd });
                onMemberUpdate(updatedUser);
                setNewFilm(initialNewFilmState);
            } catch (error) {
                console.error("Erreur lors de l'ajout du film:", error);
            }
        }
    };

    const handleRemoveFilm = async (indexToRemove: number) => {
        try {
            const updatedUser = await apiClient.delete(`/api/users/${member.id}/filmography/${indexToRemove}`);
            onMemberUpdate(updatedUser);
        } catch (error) {
            console.error("Erreur lors de la suppression du film:", error);
        }
    };

    const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const newPhotoUrl = reader.result as string;
                try {
                    const updatedUser = await apiClient.post(`/api/users/${member.id}/gallery`, { photoUrl: newPhotoUrl });
                    onMemberUpdate(updatedUser);
                } catch (error) {
                    console.error("Erreur lors de l'ajout de la photo:", error);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleRemovePhoto = async (idToRemove: number) => {
        try {
            const updatedUser = await apiClient.delete(`/api/users/${member.id}/gallery/${idToRemove}`);
            onMemberUpdate(updatedUser);
        } catch (error) {
            console.error("Erreur lors de la suppression de la photo:", error);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const newAvatarUrl = reader.result as string;
                try {
                    const updatedUser = await apiClient.put(`/api/users/${member.id}/avatar`, { avatarUrl: newAvatarUrl });
                    onMemberUpdate(updatedUser);
                } catch (error) {
                    console.error("Erreur lors du changement d'avatar:", error);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleCotisationPaymentConfirm = async () => {
        try {
             const updatedUser = await apiClient.put(`/api/users/${member.id}/payment`, { year: latestPayment.year });
             onMemberUpdate(updatedUser);
             setIsCotisationPaymentModalOpen(false);
             setShowCotisationSuccessMessage(true);
             setTimeout(() => setShowCotisationSuccessMessage(false), 5000);
        } catch (error) {
            console.error("Erreur lors de la confirmation du paiement:", error);
        }
    };

    const handleCvPaymentConfirm = () => {
        setIsCvPaymentModalOpen(false);
        setShowCvSuccessMessage(true);
        setTimeout(() => setShowCvSuccessMessage(false), 5000);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);
        if (passwordData.new1 !== passwordData.new2) {
            setPasswordMessage({ text: "Les nouveaux mots de passe ne correspondent pas.", type: 'error' });
            return;
        }
        if (passwordData.new1.length < 8) {
             setPasswordMessage({ text: "Le nouveau mot de passe doit faire au moins 8 caractères.", type: 'error' });
            return;
        }
        try {
            await apiClient.put(`/api/users/${member.id}/password`, { oldPassword: passwordData.old, newPassword: passwordData.new1 });
            setPasswordMessage({ text: "Votre mot de passe a été modifié avec succès.", type: 'success' });
            setPasswordData({ old: '', new1: '', new2: '' });
        } catch (error: any) {
             setPasswordMessage({ text: error.message || "Erreur lors du changement de mot de passe.", type: 'error' });
        }
    };

     const handle2FAToggle = async (enabled: boolean) => {
        if (enabled) {
            setIs2FAModalOpen(true);
        } else {
            if (window.confirm("Êtes-vous sûr de vouloir désactiver la vérification à deux facteurs ?")) {
                try {
                    const updatedUser = await apiClient.put(`/api/users/${member.id}/2fa`, { enabled: false });
                    onMemberUpdate(updatedUser);
                } catch (error) {
                     console.error("Erreur lors de la désactivation de la 2FA:", error);
                }
            }
        }
    };
    
    const handle2FAConfirm = async () => {
         try {
            const updatedUser = await apiClient.put(`/api/users/${member.id}/2fa`, { enabled: true });
            onMemberUpdate(updatedUser);
            setIs2FAModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de l'activation de la 2FA:", error);
        }
    };

    return (
        <>
            <div className="space-y-8">
                {showCotisationSuccessMessage && (
                    <div className="bg-green-600 text-white p-4 rounded-lg text-center font-bold mb-6">
                        Paiement réussi ! Votre cotisation a bien été enregistrée.
                    </div>
                )}
                 {showCvSuccessMessage && (
                    <div className="bg-green-600 text-white p-4 rounded-lg text-center font-bold mb-6">
                        Paiement réussi ! Votre CV labellisé vous sera envoyé par email.
                    </div>
                )}

                <h1 className="text-4xl font-bold">Tableau de bord de <span className="text-brand-red">{member.name}</span></h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Column 1: Profile, Status & Cotisations */}
                    <div className="space-y-8">
                        <DashboardCard title="Mon Profil">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative group w-32 h-32 mb-4">
                                    <img src={member.avatarUrl} alt={member.name} className="w-32 h-32 rounded-full object-cover border-4 border-brand-red"/>
                                    <label htmlFor="avatarUpload" className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-60 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300">
                                        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="text-white text-xs mt-1 opacity-0 group-hover:opacity-100">Changer</span>
                                    </label>
                                    <input type="file" id="avatarUpload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </div>
                                
                                <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
                                    {member.role && member.role !== 'Membre' && <RoleBadge role={member.role} />}
                                    <StatusBadge status={member.status} />
                                </div>

                                <p className="text-lg font-semibold">{member.specialty}</p>
                                <p className="text-gray-400 mt-2">{member.email}</p>
                                <p className="text-gray-400">{member.phone}</p>
                            </div>
                        </DashboardCard>
                        
                        <DashboardCard title="Statut de Disponibilité">
                            <select
                                value={member.availability}
                                onChange={handleAvailabilityChange}
                                className="w-full p-3 bg-brand-dark border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                            >
                                {Object.values(Availability).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </DashboardCard>
                    </div>

                    {/* Column 2: Filmography */}
                    <div className="space-y-8 lg:col-span-1">
                         <DashboardCard title="Gérer ma Filmographie" className="h-full">
                            <div className="flex flex-col h-full">
                                <ul className="space-y-2 mb-4 flex-grow max-h-96 overflow-y-auto pr-2">
                                    {member.filmography.map((film, index) => (
                                        <li key={index} className="bg-brand-dark p-2 rounded-md flex justify-between items-center text-sm">
                                            <div>
                                                <span className="font-semibold">{film.title}</span>
                                                <span className="text-gray-400 block">{film.month.toString().padStart(2, '0')}/{film.year} - {film.role}</span>
                                            </div>
                                            <button onClick={() => handleRemoveFilm(index)} className="text-red-500 hover:text-red-400 font-bold text-xl px-2">&times;</button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t border-gray-700 pt-4 space-y-3">
                                    <h3 className="font-semibold text-gray-300">Ajouter une production</h3>
                                    <input type="text" placeholder="Titre du film" value={newFilm.title} onChange={(e) => setNewFilm({...newFilm, title: e.target.value})} className="w-full text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Mois" value={newFilm.month} onChange={(e) => setNewFilm({...newFilm, month: Math.max(1, Math.min(12, parseInt(e.target.value) || 1))})} className="w-1/4 text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red" min="1" max="12"/>
                                        <input type="number" placeholder="Année" value={newFilm.year} onChange={(e) => setNewFilm({...newFilm, year: parseInt(e.target.value) || new Date().getFullYear()})} className="w-1/4 text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                                        <input type="text" placeholder="Rôle" value={newFilm.role} onChange={(e) => setNewFilm({...newFilm, role: e.target.value})} className="w-1/2 text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                                    </div>
                                    <div className="flex gap-2">
                                        <select 
                                            value={newFilm.type} 
                                            onChange={(e) => setNewFilm({...newFilm, type: e.target.value as Film['type']})} 
                                            className="w-2/3 text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"
                                        >
                                            <option value="Long Métrage">Long Métrage</option>
                                            <option value="Série TV">Série TV</option>
                                            <option value="Publicité">Publicité</option>
                                            <option value="Court Métrage">Court Métrage</option>
                                            <option value="Documentaire">Documentaire</option>
                                        </select>
                                        <input type="number" placeholder="Impact (1-5)" title="Impact (1-5)" value={newFilm.impactScore} onChange={(e) => setNewFilm({...newFilm, impactScore: Math.max(1, Math.min(5, parseInt(e.target.value) || 1))})} className="w-1/3 text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red" min="1" max="5"/>
                                    </div>
                                    {newFilm.type === 'Long Métrage' && (
                                        <input type="number" placeholder="Entrées en Salle" value={newFilm.boxOffice || ''} onChange={(e) => setNewFilm({...newFilm, boxOffice: parseInt(e.target.value) || undefined})} className="w-full text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red" />
                                    )}
                                    {newFilm.type === 'Série TV' && (
                                        <input type="number" placeholder="Audience TV" value={newFilm.audience || ''} onChange={(e) => setNewFilm({...newFilm, audience: parseInt(e.target.value) || undefined})} className="w-full text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red" />
                                    )}
                                    <button onClick={handleAddFilm} className="w-full bg-brand-red text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">Ajouter</button>
                                </div>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* Column 3: Gallery & Cotisations */}
                     <div className="space-y-8 lg:col-span-1">
                        <DashboardCard title="Ma Galerie Photo">
                            <div className="grid grid-cols-3 gap-2 mb-4 max-h-96 overflow-y-auto pr-2">
                                {member.gallery.map(photo => (
                                    <div key={photo.id} className="relative group aspect-square">
                                        <img src={photo.url} alt={`Galerie ${photo.id}`} className="w-full h-full object-cover rounded-md"/>
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex justify-center items-center">
                                            <button onClick={() => handleRemovePhoto(photo.id)} className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">&times;</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <div>
                                <label htmlFor="photoUpload" className="w-full text-center cursor-pointer bg-brand-dark border-2 border-dashed border-gray-600 rounded-md p-4 block hover:bg-gray-800 transition-colors">
                                    <span className="text-gray-400">Ajouter une photo</span>
                                </label>
                                <input type="file" id="photoUpload" className="hidden" accept="image/*" onChange={handleAddPhoto} />
                            </div>
                        </DashboardCard>

                         <DashboardCard title="Historique des Cotisations">
                            <div className="space-y-3">
                                <div className="max-h-60 overflow-y-auto pr-2">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="p-2 font-semibold text-gray-400">Année</th>
                                                <th className="p-2 font-semibold text-gray-400">Statut</th>
                                                <th className="p-2 font-semibold text-gray-400 text-right">Montant</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {member.paymentHistory.sort((a,b) => b.year - a.year).map(payment => (
                                                <tr key={payment.id} className="border-b border-gray-800">
                                                    <td className="p-2">{payment.year}</td>
                                                    <td className="p-2">
                                                        <span className={`px-2 py-0.5 text-xs rounded-full ${payment.status === 'Payée' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                            {payment.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-2 text-right text-gray-300">{payment.amount.toLocaleString('fr-FR')} FCFA</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {isPaymentDue ? (
                                    <button 
                                        onClick={() => setIsCotisationPaymentModalOpen(true)}
                                        className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-green-700 transition-colors">
                                        Payer ma cotisation
                                    </button>
                                ) : (
                                    <div className="text-center p-2 bg-green-900 text-green-200 rounded-md text-sm">
                                        Votre cotisation est à jour. Merci !
                                    </div>
                                )}
                            </div>
                        </DashboardCard>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <DashboardCard title="CV Officiel RETECHCI">
                        <p className="text-gray-400 mb-4">Obtenez une version professionnelle de votre CV, mise en page et labellisée avec le logo officiel de l'association.</p>
                        <p className="text-gray-300 font-bold mb-4">Coût du service : 2 500 FCFA</p>
                        <button 
                            onClick={() => setIsCvPaymentModalOpen(true)}
                            className="w-full bg-brand-red text-white font-bold py-2.5 px-4 rounded-md hover:bg-opacity-90 transition-colors"
                        >
                            Télécharger mon CV officiel
                        </button>
                    </DashboardCard>
                    <DashboardCard title="Sécurité du Compte">
                        <div className="space-y-6">
                            {/* Change Password */}
                            <div>
                                <h3 className="font-semibold text-white mb-2">Changer le mot de passe</h3>
                                <form onSubmit={handlePasswordChange} className="space-y-3">
                                    <input type="password" placeholder="Ancien mot de passe" value={passwordData.old} onChange={(e) => setPasswordData({...passwordData, old: e.target.value})} required className="w-full text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                                    <input type="password" placeholder="Nouveau mot de passe" value={passwordData.new1} onChange={(e) => setPasswordData({...passwordData, new1: e.target.value})} required className="w-full text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                                    <input type="password" placeholder="Confirmer le nouveau mot de passe" value={passwordData.new2} onChange={(e) => setPasswordData({...passwordData, new2: e.target.value})} required className="w-full text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                                    {passwordMessage && <p className={`text-xs text-center p-2 rounded-md ${passwordMessage.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{passwordMessage.text}</p>}
                                    <button type="submit" className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm">Mettre à jour</button>
                                </form>
                            </div>

                            {/* 2FA */}
                            <div className="border-t border-gray-700 pt-4">
                                <h3 className="font-semibold text-white mb-2">Vérification à deux facteurs (2FA)</h3>
                                <div className="flex items-center justify-between bg-brand-dark p-3 rounded-md">
                                    <div className="flex items-center">
                                        {member.twoFactorEnabled ? (
                                            <svg className="w-6 h-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6.364-6.364l-1.414-1.414M6.343 6.343l1.414 1.414m12.728 0l-1.414 1.414M17.657 17.657l-1.414-1.414M12 21a9 9 0 110-18 9 9 0 010 18zm0-5a4 4 0 100-8 4 4 0 000 8z" /></svg>
                                        )}
                                         <p className="text-sm text-gray-300">
                                            {member.twoFactorEnabled ? '2FA est activée' : '2FA est désactivée'}
                                        </p>
                                    </div>
                                   
                                    <button onClick={() => handle2FAToggle(!member.twoFactorEnabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${member.twoFactorEnabled ? 'bg-green-600' : 'bg-gray-600'}`}>
                                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${member.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <DashboardCard title="Transparence Financière">
                        <p className="text-gray-400 mb-4 text-sm">État des recettes et des dépenses de l'association par année.</p>
                        <FinancialChart data={financialData} />
                    </DashboardCard>

                     {isExecutiveMember ? (
                        <DashboardCard title="Communication avec les Membres">
                            <p className="text-gray-400 text-sm mb-4">Contactez directement les membres de l'association.</p>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {allMembers.filter(m => m.id !== member.id).map(otherMember => (
                                    <div key={otherMember.id} className="bg-brand-dark p-3 rounded-md flex items-center justify-between gap-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={otherMember.avatarUrl} alt={otherMember.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0"/>
                                            <div>
                                                <p className="font-bold text-white">{otherMember.name}</p>
                                                <p className="text-xs text-brand-red">{otherMember.specialty}</p>
                                                <div className="mt-1"><StatusBadge status={otherMember.status} /></div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setContactingMember(otherMember)}
                                            className="bg-brand-red text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-opacity-80 transition-colors whitespace-nowrap flex-shrink-0"
                                        >
                                            Laisser un message
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </DashboardCard>
                    ) : (
                        <DashboardCard title="Contacter le Bureau Exécutif">
                            <p className="text-gray-400 text-sm mb-4">Pour toute question ou problème concernant l'association, vous pouvez contacter un membre du bureau.</p>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {bureauMembers.map(beMember => (
                                    <div key={beMember.id} className="bg-brand-dark p-3 rounded-md flex items-center justify-between gap-4">
                                        <div className="flex items-center space-x-3">
                                            <img src={beMember.avatarUrl} alt={beMember.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0"/>
                                            <div>
                                                <p className="font-bold text-white">{beMember.name}</p>
                                                <p className="text-xs text-brand-red">{beMember.role}</p>
                                                <p className="text-xs text-gray-400">{beMember.specialty}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setContactingMember(beMember)}
                                            className="bg-brand-red text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-opacity-80 transition-colors whitespace-nowrap flex-shrink-0"
                                        >
                                            Laisser un message
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </DashboardCard>
                    )}
                </div>

            </div>
            
            {isCotisationPaymentModalOpen && 
                <PaymentModal 
                    onClose={() => setIsCotisationPaymentModalOpen(false)} 
                    onConfirm={handleCotisationPaymentConfirm}
                    title="Paiement de la Cotisation"
                    amount={25000}
                    description="Veuillez sélectionner votre méthode de paiement pour finaliser votre adhésion pour l'année en cours."
                />
            }

            {isCvPaymentModalOpen &&
                <PaymentModal 
                    onClose={() => setIsCvPaymentModalOpen(false)} 
                    onConfirm={handleCvPaymentConfirm}
                    title="Achat du CV Officiel"
                    amount={2500}
                    description="Paiement pour la génération et le téléchargement de votre CV au format officiel du RETECHCI."
                />
            }

            {contactingMember && (
                <InterestModal 
                    itemName={`Message pour ${contactingMember.name} (${contactingMember.role || contactingMember.specialty})`}
                    onClose={() => setContactingMember(null)}
                />
            )}

            {is2FAModalOpen && (
                <TwoFactorAuthModal 
                    onClose={() => setIs2FAModalOpen(false)}
                    onConfirm={handle2FAConfirm}
                />
            )}
        </>
    );
};

export default DashboardPage;