import React, { useState, useMemo, useEffect } from 'react';
import { Member, FinancialTransaction, UserRole, MembershipApplication, ApplicationStatus, MemberStatus, AdminMessage, Availability, LiveEvent, LiveEventAccess } from '../types';
import { ALL_USER_ROLES } from '../constants';
import apiClient from '../api/client';

interface AdminPageProps {
  currentUser: Member;
}

const AdminCard: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-brand-gray p-6 rounded-lg shadow-lg ${className}`}>
        {title && <h2 className="text-xl font-bold text-brand-red border-b-2 border-brand-red pb-2 mb-4">{title}</h2>}
        {children}
    </div>
);

type AdminTab = 'candidatures' | 'membres' | 'finances' | 'convocations' | 'messagerie' | 'direct';

const ApplicationDetailsModal: React.FC<{ application: MembershipApplication | null; onClose: () => void; }> = ({ application, onClose }) => {
    if (!application) return null;

    const fullName = `${application.firstName} ${application.lastName}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-gray rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-brand-red">Dossier de Candidature</h2>
                            <p className="text-lg text-white">{fullName}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                    </div>
                    <div className="mt-4 border-t border-gray-700 pt-4 space-y-4 text-sm">
                        <div><strong className="text-gray-400 w-32 inline-block">Spécialité:</strong> <span className="text-gray-200">{application.specialty}</span></div>
                        <div><strong className="text-gray-400 w-32 inline-block">Email:</strong> <span className="text-gray-200">{application.email}</span></div>
                        <div><strong className="text-gray-400 w-32 inline-block">Téléphone:</strong> <span className="text-gray-200">{application.phone}</span></div>
                        {application.cvFileName && (
                            <div><strong className="text-gray-400 w-32 inline-block">CV/Document:</strong> <span className="text-gray-200 italic">{application.cvFileName}</span></div>
                        )}
                        <div className="pt-2">
                            <h3 className="font-semibold text-gray-300 mb-1">Biographie</h3>
                            <p className="bg-brand-dark p-3 rounded-md text-gray-300 whitespace-pre-wrap">{application.bio}</p>
                        </div>
                        <div className="pt-2">
                            <h3 className="font-semibold text-gray-300 mb-1">Motivations</h3>
                            <p className="bg-brand-dark p-3 rounded-md text-gray-300 whitespace-pre-wrap">{application.motivation}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const MessageDetailsModal: React.FC<{ message: AdminMessage | null; onClose: () => void; }> = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-gray rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="border-b border-gray-700 pb-3 mb-4">
                         <div className="flex justify-between items-start">
                             <h2 className="text-2xl font-bold text-brand-red">Lecture du Message</h2>
                             <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                         </div>
                         <p className="text-sm text-gray-400">De: {message.senderName} &lt;{message.senderEmail}&gt;</p>
                         <p className="text-sm text-gray-400">Le: {new Date(message.date).toLocaleString('fr-FR')}</p>
                         <h3 className="text-lg text-white mt-2 font-semibold">{message.subject}</h3>
                    </div>
                    <div className="mt-4 text-gray-300 whitespace-pre-wrap">
                        {message.message}
                    </div>
                </div>
            </div>
        </div>
    );
};


const AddSpecialMemberModal: React.FC<{ onClose: () => void; onAdd: (members: Member[]) => void; showNotification: (msg: string, type?: 'success' | 'error') => void; }> = ({ onClose, onAdd, showNotification }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        specialty: '',
        status: 'Membre d\'Honneur' as 'Membre d\'Honneur' | 'Membre Bienfaiteur',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const updatedMembers = await apiClient.post('/api/admin/members', formData);
            onAdd(updatedMembers);
            showNotification(`Le membre ${formData.firstName} ${formData.lastName} a été ajouté avec succès.`);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-gray rounded-lg shadow-xl w-11/12 max-w-md" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                        <h2 className="text-2xl font-bold text-brand-red">Ajouter un Membre Spécial</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                    </div>
                    {error && <p className="text-red-400 bg-red-900 bg-opacity-50 p-2 rounded-md text-sm text-center mb-4">{error}</p>}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">Prénom</label>
                                <input type="text" name="firstName" id="firstName" required value={formData.firstName} onChange={handleChange} className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Nom</label>
                                <input type="text" name="lastName" id="lastName" required value={formData.lastName} onChange={handleChange} className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                            <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red" />
                        </div>
                        <div>
                            <label htmlFor="specialty" className="block text-sm font-medium text-gray-300">Spécialité</label>
                            <input type="text" name="specialty" id="specialty" required value={formData.specialty} onChange={handleChange} className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red" />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-300">Statut</label>
                            <select name="status" id="status" required value={formData.status} onChange={handleChange} className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red">
                                <option value="Membre d'Honneur">Membre d'Honneur</option>
                                <option value="Membre Bienfaiteur">Membre Bienfaiteur</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-4 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700">Annuler</button>
                            <button type="submit" className="px-4 py-2 rounded-md text-white bg-brand-red hover:bg-opacity-80">Créer le Membre</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FinancePanel = ({ currentUser, initialTransactions, onUpdate }: { currentUser: Member; initialTransactions: FinancialTransaction[]; onUpdate: (tx: FinancialTransaction[]) => void; }) => {
    const [transactions, setTransactions] = useState<FinancialTransaction[]>(initialTransactions);

    useEffect(() => {
        setTransactions(initialTransactions);
    }, [initialTransactions]);

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [newTransaction, setNewTransaction] = useState({ 
        date: new Date().toISOString().split('T')[0], 
        description: '', 
        amount: 0, 
        type: 'recette' as 'recette' | 'dépense' 
    });

    const [filterYear, setFilterYear] = useState<number | 'all'>(new Date().getFullYear());
    const [filterMonth, setFilterMonth] = useState<number | 'all'>(new Date().getMonth() + 1);

    const userRole = currentUser.role || 'Membre';
    const canEditFinances = userRole === 'Trésorière' || userRole === 'Directeur Exécutif';

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };
    
    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newTransaction.description || newTransaction.amount <= 0) {
            showNotification("Veuillez remplir tous les champs correctement.", 'error');
            return;
        }
        
        try {
            const updatedTransactions = await apiClient.post('/api/admin/transactions', newTransaction);
            onUpdate(updatedTransactions);
            setNewTransaction({ date: new Date().toISOString().split('T')[0], description: '', amount: 0, type: 'recette' });
            showNotification(`Transaction ajoutée avec succès.`);
        } catch(err) {
            showNotification(`Erreur lors de l'ajout.`, 'error');
        }
    };
    
    const availableYears = useMemo(() => {
        const years = new Set(transactions.map(t => new Date(t.date).getFullYear()));
        return Array.from(years).sort((a: number, b: number) => b - a);
    }, [transactions]);
    
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const date = new Date(t.date);
            const matchYear = filterYear === 'all' || date.getFullYear() === filterYear;
            const matchMonth = filterMonth === 'all' || (date.getMonth() + 1) === filterMonth;
            return matchYear && matchMonth;
        });
    }, [transactions, filterYear, filterMonth]);
    
    const totals = useMemo(() => {
        return filteredTransactions.reduce((acc: { recettes: number; dépenses: number }, curr) => {
            if (curr.type === 'recette') acc.recettes += curr.amount;
            else acc.dépenses += curr.amount;
            return acc;
        }, { recettes: 0, dépenses: 0 });
    }, [filteredTransactions]);

    return (
        <AdminCard title="Détail Financier">
                    <div className="space-y-4">
                         {notification && (
                            <div className={`p-2 rounded-md text-white text-center text-sm font-bold ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                                {notification.message}
                            </div>
                        )}
                        <div className="flex gap-4">
                            <select value={filterYear} onChange={e => setFilterYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))} className="w-full text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red">
                                <option value="all">Toutes les années</option>
                                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))} className="w-full text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red">
                                <option value="all">Tous les mois</option>
                                {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{new Date(0, m-1).toLocaleString('fr-FR', {month: 'long'})}</option>)}
                            </select>
                        </div>

                        <div className="bg-brand-dark p-4 rounded-md flex justify-around text-center">
                            <div>
                                <p className="text-sm text-gray-400">Recettes</p>
                                <p className="text-lg font-bold text-green-500">{totals.recettes.toLocaleString('fr-FR')} FCFA</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-400">Dépenses</p>
                                <p className="text-lg font-bold text-red-500">{totals.dépenses.toLocaleString('fr-FR')} FCFA</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-400">Solde</p>
                                <p className={`text-lg font-bold ${(totals.recettes - totals.dépenses) >= 0 ? 'text-white' : 'text-red-500'}`}>{(totals.recettes - totals.dépenses).toLocaleString('fr-FR')} FCFA</p>
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto pr-2 border-t border-b border-gray-700 py-2">
                             <table className="w-full text-left text-sm">
                                <tbody>
                                {filteredTransactions.map(tx => (
                                    <tr key={tx.id} className="border-b border-gray-800">
                                        <td className="p-2">{new Date(tx.date).toLocaleDateString('fr-FR')}</td>
                                        <td className="p-2 text-gray-300">{tx.description}</td>
                                        <td className={`p-2 text-right font-semibold ${tx.type === 'recette' ? 'text-green-400' : 'text-red-400'}`}>{tx.amount.toLocaleString('fr-FR')}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                             {filteredTransactions.length === 0 && <p className="text-center text-gray-500 py-4">Aucune transaction pour cette période.</p>}
                        </div>

                        {canEditFinances ? (
                             <form onSubmit={handleAddTransaction} className="space-y-3">
                                <h3 className="font-semibold text-white">Ajouter une transaction</h3>
                                <input type="date" value={newTransaction.date} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} required className="w-full text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                                <input type="text" placeholder="Description" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} required className="w-full text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                                <div className="flex gap-2">
                                    <input type="number" placeholder="Montant" value={newTransaction.amount || ''} onChange={e => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})} required className="w-2/3 text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                                    <select value={newTransaction.type} onChange={e => setNewTransaction({...newTransaction, type: e.target.value as any})} className="w-1/3 text-sm bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red">
                                        <option value="recette">Recette</option>
                                        <option value="dépense">Dépense</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-brand-red text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">Enregistrer</button>
                            </form>
                        ) : (
                            <p className="text-xs text-yellow-400 mt-4 text-center">Mode lecture seule. Seul le trésorier peut ajouter des transactions.</p>
                        )}
                    </div>
                </AdminCard>
    );
};


const AdminPage: React.FC<AdminPageProps> = ({ currentUser }) => {
    const [allMembers, setAllMembers] = useState<Member[]>([]);
    const [applications, setApplications] = useState<MembershipApplication[]>([]);
    const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([]);
    const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
    const [liveEvent, setLiveEvent] = useState<LiveEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [activeTab, setActiveTab] = useState<AdminTab>('candidatures');
    const [convocationModal, setConvocationModal] = useState<{ title: string; content: string } | null>(null);
    const [viewingApplication, setViewingApplication] = useState<MembershipApplication | null>(null);
    const [viewingMessage, setViewingMessage] = useState<AdminMessage | null>(null);
    const [statusChangeConfirm, setStatusChangeConfirm] = useState<{ member: Member, newStatus: MemberStatus } | null>(null);
    const [roleChangeConfirm, setRoleChangeConfirm] = useState<{ member: Member, newRole: UserRole } | null>(null);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    
    const [liveEventForm, setLiveEventForm] = useState<Partial<LiveEvent>>({});

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setIsLoading(true);
                const [membersData, appsData, messagesData, transactionsData, eventData] = await Promise.all([
                    apiClient.get('/api/technicians'),
                    apiClient.get('/api/admin/applications'),
                    apiClient.get('/api/admin/messages'),
                    apiClient.get('/api/admin/transactions'),
                    apiClient.get('/api/live/event'),
                ]);
                setAllMembers(membersData);
                setApplications(appsData);
                setAdminMessages(messagesData);
                setTransactions(transactionsData);
                setLiveEvent(eventData);
                setLiveEventForm(eventData || {});
            } catch (error) {
                console.error("Erreur lors de la récupération des données d'administration:", error);
                showNotification("Impossible de charger les données.", 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminData();
    }, []);


    const userRole = currentUser.role || 'Membre';
    
    // Permissions
    const canApproveApplication = userRole === 'Président du CA';
    const canActivateMember = userRole === 'Directeur Exécutif';
    const canSanctionMember = userRole === 'Président du CA';
    const canSendConvocation = userRole === 'Directeur Exécutif' || userRole === 'Président du CA';
    const canViewApplication = userRole === 'Président du CA' || userRole === 'Directeur Exécutif';
    const canChangeStatus = userRole === 'Directeur Exécutif';
    const canChangeRole = userRole === 'Directeur Exécutif';
    const canManageLive = userRole === 'Directeur Exécutif' || userRole === 'Président du CA';
    const canViewMessages = [
        'Directeur Exécutif', 'Président du CA', 'Secrétaire Général', 
        'Secrétaire Général Adjoint', 'Secrétaire à la communication', 
        'Secrétaire à la communication Adjoint', 'Trésorière', 'Trésorier Adjoint'
    ].includes(userRole);


    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // --- Application Management ---
    const handleApproveApplication = async (appId: number) => {
        try {
            const updatedApps = await apiClient.put(`/api/admin/applications/${appId}/approve`, {});
            setApplications(updatedApps);
            showNotification("Candidature approuvée. Le Directeur Exécutif peut maintenant envoyer une invitation.");
        } catch (error) { showNotification("Erreur lors de l'approbation.", 'error'); }
    };
    
    const handleSendInvitation = async (appId: number) => {
        try {
            const updatedApps = await apiClient.put(`/api/admin/applications/${appId}/invite`, {});
            setApplications(updatedApps);
            showNotification("Invitation envoyée au candidat. En attente de sa finalisation.");
        } catch (error) { showNotification("Erreur lors de l'envoi de l'invitation.", 'error'); }
    };

    const handleFinalizeActivation = async (application: MembershipApplication) => {
       try {
            const { members, applications } = await apiClient.post(`/api/admin/applications/${application.id}/activate`, {});
            setAllMembers(members);
            setApplications(applications);
            showNotification(`Le membre ${application.firstName} ${application.lastName} a été activé et ajouté à l'annuaire.`);
        } catch (error) { showNotification("Erreur lors de l'activation.", 'error'); }
    };


    // --- Member Management ---
    const handleSanctionMember = async (memberId: number) => {
        if(window.confirm("Êtes-vous sûr de vouloir sanctionner ce membre ? Cette action est visible par les autres administrateurs.")) {
            try {
                const updatedMembers = await apiClient.put(`/api/admin/members/${memberId}/sanction`, {});
                setAllMembers(updatedMembers);
                showNotification("Le membre a été marqué comme 'Sanctionné'.");
            } catch(error) { showNotification("Erreur lors de la sanction.", 'error'); }
        }
    };
    
    const handleStatusChangeRequest = (member: Member, newStatus: MemberStatus) => {
        if (member.status !== newStatus) {
            setStatusChangeConfirm({ member, newStatus });
        }
    };

    const executeStatusChange = async () => {
        if (!statusChangeConfirm) return;
        const { member, newStatus } = statusChangeConfirm;
        try {
            const updatedMembers = await apiClient.put(`/api/admin/members/${member.id}/status`, { status: newStatus });
            setAllMembers(updatedMembers);
            showNotification(`Le statut de ${member.name} a été mis à jour.`);
        } catch (error) { showNotification("Erreur lors du changement de statut.", 'error'); }
        setStatusChangeConfirm(null);
    };

    const handleRoleChangeRequest = (member: Member, newRole: UserRole) => {
        if (member.role !== newRole) {
            setRoleChangeConfirm({ member, newRole });
        }
    };
    
    const executeRoleChange = async () => {
        if (!roleChangeConfirm) return;
        const { member, newRole } = roleChangeConfirm;
        try {
            const updatedMembers = await apiClient.put(`/api/admin/members/${member.id}/role`, { role: newRole });
            setAllMembers(updatedMembers);
            showNotification(`Le rôle de ${member.name} a été défini sur ${newRole}.`);
        } catch (error) { showNotification("Erreur lors du changement de rôle.", 'error'); }
        setRoleChangeConfirm(null);
    };


    const getStatusChip = (status: MemberStatus) => {
        const baseClasses = "px-2 py-0.5 text-xs rounded-full font-semibold";
        switch (status) {
            case 'Membre Actif':
                return <span className={`${baseClasses} bg-green-200 text-green-800`}>Actif</span>;
            case 'Membre d\'Honneur':
                return <span className={`${baseClasses} bg-blue-200 text-blue-800`}>d'Honneur</span>;
            case 'Membre Bienfaiteur':
                return <span className={`${baseClasses} bg-yellow-200 text-yellow-800`}>Bienfaiteur</span>;
            case 'Sanctionné':
                return <span className={`${baseClasses} bg-red-200 text-red-800`}>Sanctionné</span>;
            default:
                return null;
        }
    };

    const getApplicationStatusChip = (status: ApplicationStatus) => {
         switch (status) {
            case ApplicationStatus.PENDING:
                return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white">En attente</span>;
            case ApplicationStatus.APPROVED_BY_CA:
                return <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500 text-white">Approuvée par CA</span>;
            case ApplicationStatus.INVITATION_SENT:
                return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500 text-black">Invitation envoyée</span>;
            case ApplicationStatus.ACTIVATED:
                 return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500 text-white">Membre Actif</span>;
            default:
                return null;
        }
    }

    // --- Convocation Management ---
    const handleConvocation = (type: 'be' | 'ca' | 'ag') => {
        let title = '';
        let content = '';
        if(type === 'be') {
            title = "Convocation du Bureau Exécutif";
            content = "Chers membres du Bureau Exécutif,\n\nVous êtes cordialement invités à la prochaine réunion qui se tiendra le [DATE] à [HEURE] au [LIEU]. L'ordre du jour est le suivant : [ORDRE DU JOUR].\n\nVotre présence est essentielle.\n\nCordialement,\nLa Direction.";
        } else if (type === 'ca') {
            title = "Convocation du Conseil d'Administration";
            content = "Chers membres du Conseil d'Administration,\n\nVous êtes priés d'assister à la prochaine réunion du CA qui se tiendra le [DATE] à [HEURE] à [LIEU].\n\nL'ordre du jour portera sur les points stratégiques suivants : [ORDRE DU JOUR].\n\nComptant sur votre présence.\n\nCordialement,\nLe Président.";
        } else { // 'ag'
             title = "Convocation à l'Assemblée Générale";
             content = "Chers membres du RETECHCI,\n\nLe Conseil d'Administration a le plaisir de vous convier à l'Assemblée Générale qui aura lieu le [DATE] à [HEURE] à [LIEU]. Nous comptons sur votre participation pour débattre et voter les points importants pour l'avenir de notre association.\n\nCordialement,\nLe Conseil d'Administration.";
        }
        setConvocationModal({ title, content });
    };

    const sendConvocation = () => {
        setConvocationModal(null);
        showNotification("Convocation envoyée à tous les membres concernés.");
    }
    
    // --- Message Management ---
    const unreadMessagesCount = useMemo(() => adminMessages.filter(m => !m.read).length, [adminMessages]);

    const handleViewMessage = async (messageId: number) => {
        const message = adminMessages.find(m => m.id === messageId);
        if (message) {
            setViewingMessage(message);
            // Mark as read
            if (!message.read) {
                try {
                    const updatedMessages = await apiClient.put(`/api/admin/messages/${messageId}/read`, {});
                    setAdminMessages(updatedMessages);
                } catch(error) { console.error("Could not mark message as read"); }
            }
        }
    };

    // --- Live Event Management ---
    const handleLiveEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLiveEventForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAccessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'accessType') {
            const type = value as 'public' | 'members_only';
            if (type === 'members_only') {
                setLiveEventForm(prev => ({ ...prev, access: { type: 'members_only' } }));
            } else {
                 setLiveEventForm(prev => ({ ...prev, access: { type: 'public', cost: 0 } }));
            }
        } else if (name === 'accessCost') {
            const cost = parseInt(value, 10) || 0;
            if (liveEventForm.access?.type === 'public') {
                setLiveEventForm(prev => ({...prev, access: { ...prev.access as {type: 'public'}, cost }}));
            }
        }
    };
    
    const handleLiveEventSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedEvent = await apiClient.put('/api/admin/live-event', liveEventForm);
            setLiveEvent(updatedEvent);
            setLiveEventForm(updatedEvent);
            showNotification("Les informations du direct ont été mises à jour.");
        } catch (error) {
            showNotification("Erreur lors de la mise à jour du direct.", "error");
        }
    };
    
    const renderCurrentTab = () => {
        if (isLoading) return <div className="text-center p-8">Chargement des données...</div>;

        const activeApplications = applications.filter(app => app.status !== ApplicationStatus.ACTIVATED);
        
        switch(activeTab) {
            case 'candidatures':
                return (
                     <AdminCard title="Nouvelles Candidatures">
                        <div className="max-h-[500px] overflow-y-auto pr-2">
                             <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="p-2 font-semibold text-gray-400">Candidat</th>
                                        <th className="p-2 font-semibold text-gray-400">Spécialité</th>
                                        <th className="p-2 font-semibold text-gray-400">Statut</th>
                                        <th className="p-2 font-semibold text-gray-400 text-center">Dossier</th>
                                        <th className="p-2 font-semibold text-gray-400 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeApplications.map(app => (
                                        <tr key={app.id} className="border-b border-gray-800">
                                            <td className="p-2 text-white">{`${app.firstName} ${app.lastName}`}</td>
                                            <td className="p-2 text-gray-300">{app.specialty}</td>
                                            <td className="p-2">{getApplicationStatusChip(app.status)}</td>
                                            <td className="p-2 text-center">
                                                {canViewApplication && (
                                                    <button onClick={() => setViewingApplication(app)} className="text-gray-400 hover:text-white underline text-xs">Voir</button>
                                                )}
                                            </td>
                                            <td className="p-2 text-center">
                                                {app.status === ApplicationStatus.PENDING && canApproveApplication && (
                                                    <button onClick={() => handleApproveApplication(app.id)} className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium hover:bg-blue-700">Approuver</button>
                                                )}
                                                {app.status === ApplicationStatus.APPROVED_BY_CA && canActivateMember && (
                                                     <button onClick={() => handleSendInvitation(app.id)} className="bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-medium hover:bg-purple-700">Envoyer l'invitation</button>
                                                )}
                                                 {app.status === ApplicationStatus.INVITATION_SENT && canActivateMember && (
                                                     <button onClick={() => handleFinalizeActivation(app)} className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium hover:bg-green-700">Finaliser l'activation</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                     {activeApplications.length === 0 && (
                                        <tr><td colSpan={5} className="text-center p-4 text-gray-500">Aucune candidature en cours.</td></tr>
                                     )}
                                </tbody>
                             </table>
                        </div>
                    </AdminCard>
                );
            case 'membres':
                 return (
                     <AdminCard title="Gestion des Membres">
                        <div className="max-h-[500px] overflow-y-auto pr-2">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="p-2 font-semibold text-gray-400">Membre</th>
                                        <th className="p-2 font-semibold text-gray-400">Rôle Actuel</th>
                                        {canChangeRole && <th className="p-2 font-semibold text-gray-400">Changer Rôle</th>}
                                        <th className="p-2 font-semibold text-gray-400">Statut</th>
                                        {canChangeStatus && <th className="p-2 font-semibold text-gray-400">Changer Statut</th>}
                                        <th className="p-2 font-semibold text-gray-400 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allMembers.map(member => (
                                        <tr key={member.id} className="border-b border-gray-800">
                                            <td className="p-2 text-white">{member.name}</td>
                                            <td className="p-2 text-gray-300">{member.role}</td>
                                             {canChangeRole && (
                                                <td className="p-2">
                                                    <select
                                                        value={member.role || 'Membre'}
                                                        onChange={(e) => handleRoleChangeRequest(member, e.target.value as UserRole)}
                                                        className="w-full text-xs bg-brand-dark border-gray-600 rounded-md p-1 focus:ring-brand-red focus:border-brand-red"
                                                    >
                                                        {ALL_USER_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                                    </select>
                                                </td>
                                            )}
                                            <td className="p-2">{getStatusChip(member.status)}</td>
                                            {canChangeStatus && (
                                                <td className="p-2">
                                                    <select
                                                        value={member.status}
                                                        onChange={(e) => handleStatusChangeRequest(member, e.target.value as MemberStatus)}
                                                        className="w-full text-xs bg-brand-dark border-gray-600 rounded-md p-1 focus:ring-brand-red focus:border-brand-red"
                                                    >
                                                        <option value="Membre Actif">Actif</option>
                                                        <option value="Membre d'Honneur">d'Honneur</option>
                                                        <option value="Membre Bienfaiteur">Bienfaiteur</option>
                                                        <option value="Sanctionné">Sanctionné</option>
                                                    </select>
                                                </td>
                                            )}
                                            <td className="p-2 text-center">
                                                {member.status !== "Sanctionné" && canSanctionMember && member.role === "Membre" && (
                                                     <button onClick={() => handleSanctionMember(member.id)} className="bg-yellow-500 text-black px-2 py-1 rounded-md text-xs font-medium hover:bg-yellow-600">Sanctionner</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {canChangeRole && (
                            <div className="mt-4 border-t border-gray-700 pt-4">
                                <button
                                    onClick={() => setIsAddMemberModalOpen(true)}
                                    className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Ajouter un Membre Spécial (Honneur/Bienfaiteur)
                                </button>
                            </div>
                        )}
                    </AdminCard>
                 );
            case 'finances':
                 return (
                     <FinancePanel currentUser={currentUser} initialTransactions={transactions} onUpdate={setTransactions} />
                 );
             case 'convocations':
                return (
                    <AdminCard title="Convocations aux Réunions">
                        {canSendConvocation ? (
                             <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-white">Bureau Exécutif (BE)</h3>
                                    <p className="text-sm text-gray-400 mb-2">Envoyer une convocation pour la prochaine réunion du Bureau Exécutif.</p>
                                    <button onClick={() => handleConvocation('be')} className="bg-gray-600 text-white w-full py-2 rounded-md hover:bg-gray-700">Convoquer le BE</button>
                                </div>
                                <div className="border-t border-gray-700 pt-4">
                                     <h3 className="font-semibold text-white">Conseil d'Administration (CA)</h3>
                                     <p className="text-sm text-gray-400 mb-2">Envoyer une convocation pour la prochaine réunion du Conseil d'Administration.</p>
                                    <button onClick={() => handleConvocation('ca')} className="bg-gray-600 text-white w-full py-2 rounded-md hover:bg-gray-700">Convoquer le CA</button>
                                </div>
                                <div className="border-t border-gray-700 pt-4">
                                     <h3 className="font-semibold text-white">Assemblée Générale (AG)</h3>
                                     <p className="text-sm text-gray-400 mb-2">Envoyer une convocation à tous les membres pour l'Assemblée Générale.</p>
                                    <button onClick={() => handleConvocation('ag')} className="bg-brand-red text-white w-full py-2 rounded-md hover:bg-opacity-80">Convoquer l'AG</button>
                                </div>
                             </div>
                        ) : (
                            <p className="text-center text-gray-500">Vous n'avez pas les permissions pour envoyer des convocations.</p>
                        )}
                    </AdminCard>
                );
            case 'messagerie':
                 return (
                     <AdminCard title="Boîte de Réception">
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                            {adminMessages.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(msg => (
                                <div 
                                    key={msg.id} 
                                    onClick={() => handleViewMessage(msg.id)}
                                    className={`p-3 rounded-md border-l-4 cursor-pointer hover:bg-gray-800 transition-colors ${msg.read ? 'bg-brand-dark border-transparent' : 'bg-blue-900 bg-opacity-30 border-blue-500'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className={`text-sm ${msg.read ? 'text-gray-400' : 'text-white font-bold'}`}>{msg.senderName}</p>
                                            <p className={`truncate max-w-xs text-sm ${msg.read ? 'text-gray-300' : 'text-white'}`}>{msg.subject}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 flex-shrink-0">{new Date(msg.date).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </AdminCard>
                 );
            case 'direct':
                return (
                    <AdminCard title="Gestion de la Retransmission en Direct">
                         <form onSubmit={handleLiveEventSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Titre de l'événement</label>
                                <input type="text" name="title" id="title" value={liveEventForm.title || ''} onChange={handleLiveEventFormChange} className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                            </div>
                             <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                                <textarea name="description" id="description" rows={3} value={liveEventForm.description || ''} onChange={handleLiveEventFormChange} className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"></textarea>
                            </div>
                             <div>
                                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300">URL de la vidéo (lien d'intégration YouTube)</label>
                                <input type="text" name="videoUrl" id="videoUrl" value={liveEventForm.videoUrl || ''} onChange={handleLiveEventFormChange} className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                            </div>
                            
                            <fieldset>
                                <legend className="block text-sm font-medium text-gray-300 mb-2">Accès</legend>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input type="radio" id="access_members_only" name="accessType" value="members_only" checked={liveEventForm.access?.type === 'members_only'} onChange={handleAccessChange} className="focus:ring-brand-red h-4 w-4 text-brand-red border-gray-300"/>
                                        <label htmlFor="access_members_only" className="ml-3 block text-sm font-medium text-gray-300">Réservé aux membres</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="radio" id="access_public" name="accessType" value="public" checked={liveEventForm.access?.type === 'public'} onChange={handleAccessChange} className="focus:ring-brand-red h-4 w-4 text-brand-red border-gray-300"/>
                                        <label htmlFor="access_public" className="ml-3 block text-sm font-medium text-gray-300">Public</label>
                                    </div>
                                </div>
                            </fieldset>

                            {liveEventForm.access?.type === 'public' && (
                                <div>
                                    <label htmlFor="accessCost" className="block text-sm font-medium text-gray-300">Coût de l'accès (0 pour gratuit)</label>
                                    <input type="number" name="accessCost" id="accessCost" value={liveEventForm.access.cost || 0} onChange={handleAccessChange} min="0" className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red"/>
                                </div>
                            )}

                             <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-300">Statut du direct</label>
                                <select name="status" id="status" value={liveEventForm.status || 'offline'} onChange={e => setLiveEventForm(prev => ({ ...prev, status: e.target.value as 'live' | 'offline'}))} className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md p-2 focus:ring-brand-red focus:border-brand-red">
                                    <option value="offline">Hors ligne</option>
                                    <option value="live">En direct</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-brand-red text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
                                    Sauvegarder les modifications
                                </button>
                            </div>
                         </form>
                    </AdminCard>
                );
            default:
                return null;
        }
    }

    const TabButton: React.FC<{tabId: AdminTab, label: string, children?: React.ReactNode}> = ({tabId, label, children}) => (
        <button 
            onClick={() => setActiveTab(tabId)}
            className={`relative flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-md whitespace-nowrap transition-all duration-200 ease-in-out ${
                activeTab === tabId
                    ? 'border-b-2 border-brand-red text-white bg-brand-gray'
                    : 'text-gray-400 hover:text-white border-b-2 border-transparent'
            }`}
        >
            <span>{label}</span>
            {children}
        </button>
    )

    return (
        <div className="space-y-6">
            {notification && (
                <div className={`p-4 rounded-lg text-white text-center font-bold ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {notification.message}
                </div>
            )}

            <div className="text-center">
                <h1 className="text-4xl font-bold">Panneau d'Administration</h1>
                <p className="text-gray-400">Connecté en tant que : <span className="font-bold text-brand-red">{userRole}</span></p>
            </div>

            <div className="border-b border-gray-700 flex space-x-2 flex-wrap">
                <TabButton tabId="candidatures" label="Candidatures" />
                <TabButton tabId="membres" label="Gestion des Membres" />
                <TabButton tabId="finances" label="Finances" />
                <TabButton tabId="convocations" label="Convocations" />
                {canViewMessages && (
                    <TabButton tabId="messagerie" label="Messagerie">
                        {unreadMessagesCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-brand-red text-white text-xs items-center justify-center">{unreadMessagesCount}</span>
                            </span>
                        )}
                    </TabButton>
                )}
                 {canManageLive && <TabButton tabId="direct" label="Gestion du Direct" />}
            </div>
            
            <div>
                 {renderCurrentTab()}
            </div>
            
            <ApplicationDetailsModal application={viewingApplication} onClose={() => setViewingApplication(null)} />
            <MessageDetailsModal message={viewingMessage} onClose={() => setViewingMessage(null)} />

            {statusChangeConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
                    <div className="bg-brand-gray rounded-lg shadow-xl w-11/12 md:w-1/3" onClick={e => e.stopPropagation()}>
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Confirmation Requise</h3>
                            <p className="text-gray-300 mb-4">
                                Confirmez-vous le changement du statut de <span className="font-semibold text-brand-red">{statusChangeConfirm.member.name}</span> à <span className="font-semibold text-brand-red">{statusChangeConfirm.newStatus}</span> ?
                            </p>
                            <p className="text-xs text-yellow-400 bg-yellow-900 bg-opacity-40 p-2 rounded-md mb-6">
                                Cette action est prise suite à l'approbation du Conseil d'Administration.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button onClick={() => setStatusChangeConfirm(null)} className="px-6 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700">Annuler</button>
                                <button onClick={executeStatusChange} className="px-6 py-2 rounded-md text-white bg-brand-red hover:bg-opacity-80">Confirmer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {roleChangeConfirm && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
                    <div className="bg-brand-gray rounded-lg shadow-xl w-11/12 md:w-1/3" onClick={e => e.stopPropagation()}>
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Confirmation de Nomination</h3>
                            <p className="text-gray-300 mb-6">
                                Confirmez-vous la nomination de <span className="font-semibold text-brand-red">{roleChangeConfirm.member.name}</span> au poste de <span className="font-semibold text-brand-red">{roleChangeConfirm.newRole}</span> ?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button onClick={() => setRoleChangeConfirm(null)} className="px-6 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700">Annuler</button>
                                <button onClick={executeRoleChange} className="px-6 py-2 rounded-md text-white bg-brand-red hover:bg-opacity-80">Confirmer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {convocationModal && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={() => setConvocationModal(null)}>
                    <div className="bg-brand-gray rounded-lg shadow-xl w-11/12 md:w-1/2" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-brand-red mb-4">{convocationModal.title}</h2>
                            <p className="text-gray-300 mb-4 whitespace-pre-wrap">{convocationModal.content}</p>
                            <div className="flex justify-end space-x-4">
                                <button onClick={() => setConvocationModal(null)} className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700">Annuler</button>
                                <button onClick={sendConvocation} className="px-4 py-2 rounded-md text-white bg-brand-red hover:bg-opacity-80">Confirmer et Envoyer</button>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

             {isAddMemberModalOpen && (
                <AddSpecialMemberModal
                    onClose={() => setIsAddMemberModalOpen(false)}
                    onAdd={(updatedMembers) => setAllMembers(updatedMembers)}
                    showNotification={showNotification}
                />
            )}
        </div>
    );
};

export default AdminPage;