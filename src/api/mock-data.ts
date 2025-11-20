
import { Member, NewsArticle, Video, Partner, Location, Costume, Prop, RentalCompany, JobSalary, MembershipApplication, FinancialTransaction, AdminMessage, Availability, ApplicationStatus, LiveEvent, LiveChatMessage, AppEvent, ForumTopic, Notification, SiteConfig } from '../types/types';

// FIX: Changed type to Member[] to include passwordHash, and cast the initial array to Omit<Member, 'passwordHash'>[] to fix type inference on properties like `role`.
export const TECHNICIANS_DATA: Member[] = ([
  {
    id: 1,
    name: 'Aya Koné',
    specialty: 'Directrice de la photographie',
    avatarUrl: 'https://picsum.photos/seed/aya/400/400',
    availability: Availability.AVAILABLE,
    bio: 'Avec plus de 10 ans d\'expérience, Aya a travaillé sur des films primés et des publicités internationales. Sa maîtrise de la lumière et du cadre apporte une dimension unique à chaque projet.',
    filmography: [
      { title: 'Lumière d\'Abidjan', year: 2022, month: 5, role: 'Chef opératrice', type: 'Long Métrage', impactScore: 5, boxOffice: 250000 },
      { title: 'Le Pacte', year: 2020, month: 11, role: 'Cadreuse', type: 'Série TV', impactScore: 4, audience: 1500000 },
      { title: 'Ivoire Commercial', year: 2019, month: 3, role: 'Directrice de la photographie', type: 'Publicité', impactScore: 4 },
    ],
    email: 'aya.kone@retechci.ci',
    phone: '+225 01 02 03 04 05',
    skills: ['Étalonnage', 'Caméra RED', 'Lumière naturelle', 'Drone'],
    membershipPaid: true,
    nextMeeting: '2024-08-15T18:00:00Z',
    notificationPreference: 'email',
    gallery: [
        { id: 1, url: 'https://picsum.photos/seed/aya-gal1/500/500' },
        { id: 2, url: 'https://picsum.photos/seed/aya-gal2/500/500' },
        { id: 3, url: 'https://picsum.photos/seed/aya-gal3/500/500' },
    ],
    paymentHistory: [
        { id: 1, year: 2024, amount: 25000, status: 'Payée', date: '2024-01-15T10:00:00Z' },
        { id: 2, year: 2023, amount: 25000, status: 'Payée', date: '2023-01-20T11:00:00Z' },
    ],
    role: 'Directeur Exécutif',
    status: 'Membre Actif',
    twoFactorEnabled: false,
  },
   {
    id: 2,
    name: 'Moussa Traoré',
    specialty: 'Ingénieur du son',
    avatarUrl: 'https://picsum.photos/seed/moussa/400/400',
    availability: Availability.UNAVAILABLE,
    bio: 'Spécialiste de la prise de son en extérieur et en studio, Moussa est reconnu pour sa capacité à capturer des ambiances sonores riches et immersives.',
    filmography: [
      { title: 'Échos de la lagune', year: 2023, month: 9, role: 'Chef preneur de son', type: 'Documentaire', impactScore: 4 },
      { title: 'Sous le soleil de Jacqueville', year: 2021, month: 7, role: 'Perchman', type: 'Long Métrage', impactScore: 5, boxOffice: 320000 },
    ],
    email: 'moussa.traore@retechci.ci',
    phone: '+225 02 03 04 05 06',
    skills: ['Mixage 5.1', 'Prise de son documentaire', 'Pro Tools', 'Sound design'],
    membershipPaid: false,
    nextMeeting: '2024-08-15T18:00:00Z',
    notificationPreference: 'sms',
    gallery: [ { id: 4, url: 'https://picsum.photos/seed/moussa-gal1/500/500' }, ],
    paymentHistory: [
        { id: 4, year: 2024, amount: 25000, status: 'Impayée', date: '2024-01-01T00:00:00Z' },
        { id: 5, year: 2023, amount: 25000, status: 'Payée', date: '2023-02-10T14:00:00Z' },
    ],
    role: 'Président du CA',
    status: 'Membre Actif',
    twoFactorEnabled: false,
  },
  {
    id: 3,
    name: 'Fatou Diop',
    specialty: 'Monteuse',
    avatarUrl: 'https://picsum.photos/seed/fatou/400/400',
    availability: Availability.SOON,
    bio: 'Fatou sculpte les récits avec précision et créativité. Son sens du rythme et de la narration transforme les rushes bruts en œuvres cinématographiques captivantes.',
    filmography: [
      { title: 'Le Collier de la Reine', year: 2022, month: 2, role: 'Cheffe monteuse', type: 'Série TV', impactScore: 5, audience: 2500000 },
      { title: 'L\'Héritage', year: 2020, month: 6, role: 'Assistante monteuse', type: 'Long Métrage', impactScore: 3, boxOffice: 80000 },
    ],
    email: 'fatou.diop@retechci.ci',
    phone: '+225 03 04 05 06 07',
    skills: ['Montage narratif', 'Adobe Premiere Pro', 'Final Cut Pro', 'After Effects'],
    membershipPaid: true,
    nextMeeting: '2024-08-15T18:00:00Z',
    notificationPreference: 'none',
    gallery: [ { id: 5, url: 'https://picsum.photos/seed/fatou-gal1/500/500' }, { id: 6, url: 'https://picsum.photos/seed/fatou-gal2/500/500' }, ],
    paymentHistory: [
        { id: 6, year: 2024, amount: 25000, status: 'Payée', date: '2024-01-10T18:00:00Z' },
        { id: 7, year: 2023, amount: 25000, status: 'Payée', date: '2023-01-12T11:30:00Z' },
    ],
    role: 'Trésorière',
    status: 'Membre Actif',
    twoFactorEnabled: false,
  },
] as Omit<Member, 'passwordHash'>[]).map(user => ({
    ...user,
    passwordHash: 'hashed_password123' // Simulates a hash for the password "password123"
}));

export const NEWS_DATA: NewsArticle[] = [
  { id: 1, title: "Masterclass Exceptionnelle avec le réalisateur Philippe Lacôte", date: "2024-07-20T10:00:00Z", summary: "Le RETECHCI a eu l'honneur d'organiser une masterclass exclusive avec le célèbre réalisateur ivoirien Philippe Lacôte.", imageUrl: "https://picsum.photos/seed/news1/800/600" },
  { id: 2, title: "Partenariat Stratégique avec le Festival 'Clap Ivoire'", date: "2024-07-15T15:30:00Z", summary: "Un accord historique a été signé entre le RETECHCI et le festival Clap Ivoire pour la promotion de nos membres.", imageUrl: "https://picsum.photos/seed/news2/800/600" },
];

export const VIDEOS_DATA: Video[] = [
    { id: 1, title: "Masterclass avec Philippe Lacôte : Les Coulisses", thumbnailUrl: "https://picsum.photos/seed/video1/400/300", duration: "12:34", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 2, title: "Interview de notre Directrice de la Photographie", thumbnailUrl: "https://picsum.photos/seed/video2/400/300", duration: "08:12", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 3, title: "Le son au cinéma : table ronde", thumbnailUrl: "https://picsum.photos/seed/video3/400/300", duration: "25:02", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 4, title: "RETECHCI : Notre mission", thumbnailUrl: "https://picsum.photos/seed/video4/400/300", duration: "03:45", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 5, title: "Les métiers de l'ombre : le machiniste", thumbnailUrl: "https://picsum.photos/seed/video5/400/300", duration: "15:55", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 6, title: "Retour sur l'AG 2023", thumbnailUrl: "https://picsum.photos/seed/video6/400/300", duration: "05:18", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
];

export const PARTNERS_DATA: Partner[] = [
    { name: 'Canal+', logoUrl: 'https://logo.clearbit.com/canalplus.com' },
    { name: 'TV5 Monde', logoUrl: 'https://logo.clearbit.com/tv5monde.com' },
    { name: 'Orange', logoUrl: 'https://logo.clearbit.com/orange.com' },
    { name: 'RTI', logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/a/a2/Logo_RTI_1.svg/1200px-Logo_RTI_1.svg.png' },
    { name: 'Unifrance', logoUrl: 'https://logo.clearbit.com/unifrance.org' },
    { name: 'OIF', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Flag_of_La_Francophonie.svg/1280px-Flag_of_La_Francophonie.svg.png' },
];

export const LOCATIONS_DATA: Location[] = [
    { id: 1, name: 'Plage de Grand-Bassam', region: 'Comoe', description: 'Vaste plage de sable fin bordée de cocotiers, avec des vestiges coloniaux.', imageUrl: 'https://picsum.photos/seed/bassam/600/400', tags: ['Plage', 'Historique', 'Nature'] },
    { id: 2, name: 'Parc National de Taï', region: 'Montagnes', description: 'Une des dernières forêts primaires d\'Afrique de l\'Ouest, biodiversité exceptionnelle.', imageUrl: 'https://picsum.photos/seed/tai/600/400', tags: ['Forêt', 'Nature', 'Sauvage'] },
    { id: 3, name: 'Le Plateau, Abidjan', region: 'Abidjan', description: 'Le centre des affaires d\'Abidjan, avec ses gratte-ciels et son architecture moderne.', imageUrl: 'https://picsum.photos/seed/plateau/600/400', tags: ['Urbain', 'Moderne', 'Affaires'] },
];

export const COSTUMES_DATA: Costume[] = [
    { id: 1, name: 'Tenue Royale Akan', description: 'Ensemble Kente tissé à la main, idéal pour les scènes de cérémonie.', creator: 'Atelier Kente d\'Or', imageUrl: 'https://picsum.photos/seed/kente/400/500', category: 'Traditionnel' },
    { id: 2, name: 'Uniforme Militaire 1980', description: 'Réplique authentique de l\'uniforme de l\'armée ivoirienne des années 80.', creator: 'Ciné-Costumes Abidjan', imageUrl: 'https://picsum.photos/seed/militaire/400/500', category: 'Historique' },
];

export const PROPS_DATA: Prop[] = [
    { id: 1, name: 'Tabouret Akan Royal', description: 'Siège en bois sculpté, symbole de pouvoir et de tradition.', creator: 'Artisan de Koumassi', imageUrl: 'https://picsum.photos/seed/tabouret/400/400', category: 'Historique' },
    { id: 2, name: 'Maquis de Rue (set complet)', description: 'Ensemble de tables, chaises et accessoires pour recréer un "maquis" typique.', creator: 'Déco-Film CI', imageUrl: 'https://picsum.photos/seed/maquis/400/400', category: 'Contemporain' },
];

export const RENTAL_COMPANIES_DATA: RentalCompany[] = [
    { id: 1, name: 'Ivoire Ciné Matos', logoUrl: 'https://picsum.photos/seed/logo1/200/200', contact: 'contact@ivoirecinematos.ci', equipment: [
        { id: 1, name: 'RED Komodo 6K', category: 'Caméra', dailyRate: 150000 },
        { id: 2, name: 'Kit Lumière Aputure 300D', category: 'Lumière', dailyRate: 75000 },
    ]},
    { id: 2, name: 'Abidjan Camera Rent', logoUrl: 'https://picsum.photos/seed/logo2/200/200', contact: 'contact@abidjancamera.com', equipment: [
        { id: 3, name: 'Sony FX6', category: 'Caméra', dailyRate: 120000 },
        { id: 4, name: 'Slider motorisé', category: 'Machinerie', dailyRate: 40000 },
        { id: 5, name: 'Kit micros HF Sennheiser', category: 'Son', dailyRate: 50000 },
    ]},
];

export const SALARY_DATA: JobSalary[] = [
    { id: 1, jobTitle: 'Directeur de production', categories: [ { category: 'A', description: 'Moins de 3 ans', weeklyRate: 400000 }, { category: 'B', description: '3 à 7 ans', weeklyRate: 600000 }, { category: 'C', description: 'Plus de 7 ans', weeklyRate: 850000 } ] },
    { id: 2, jobTitle: 'Directeur photo / Chef OPV', categories: [ { category: 'A', description: 'Moins de 3 ans', weeklyRate: 350000 }, { category: 'B', description: '3 à 7 ans', weeklyRate: 550000 }, { category: 'C', description: 'Plus de 7 ans', weeklyRate: 800000 } ] },
    { id: 3, jobTitle: 'Chef OPS / Ingénieur du son', categories: [ { category: 'A', description: 'Moins de 3 ans', weeklyRate: 300000 }, { category: 'B', description: '3 à 7 ans', weeklyRate: 450000 }, { category: 'C', description: 'Plus de 7 ans', weeklyRate: 650000 } ] },
    { id: 4, jobTitle: 'Chef monteur', categories: [ { category: 'A', description: 'Moins de 3 ans', weeklyRate: 250000 }, { category: 'B', description: '3 à 7 ans', weeklyRate: 400000 }, { category: 'C', description: 'Plus de 7 ans', weeklyRate: 600000 } ] },
    { id: 5, jobTitle: 'Chef électricien', categories: [ { category: 'A', description: 'Moins de 3 ans', weeklyRate: 200000 }, { category: 'B', description: '3 à 7 ans', weeklyRate: 300000 }, { category: 'C', description: 'Plus de 7 ans', weeklyRate: 450000 } ] },
    { id: 6, jobTitle: 'Chef machiniste', categories: [ { category: 'A', description: 'Moins de 3 ans', weeklyRate: 200000 }, { category: 'B', description: '3 à 7 ans', weeklyRate: 300000 }, { category: 'C', description: 'Plus de 7 ans', weeklyRate: 450000 } ] },
    { id: 7, jobTitle: 'Scripte', categories: [ { category: 'A', description: 'Moins de 3 ans', weeklyRate: 180000 }, { category: 'B', description: '3 à 7 ans', weeklyRate: 280000 }, { category: 'C', description: 'Plus de 7 ans', weeklyRate: 400000 } ] },
];

export const MEMBERSHIP_APPLICATIONS_DATA: MembershipApplication[] = [
    { id: 1, firstName: 'Koffi', lastName: 'Amon', email: 'k.amon@email.com', phone: '0707070707', specialty: 'Cadreur', bio: 'Jeune cadreur passionné par le documentaire.', motivation: 'Apprendre des aînés.', cvFileName: 'cv_koffi_amon.pdf', date: '2024-07-28T10:00:00Z', status: ApplicationStatus.PENDING },
    { id: 2, firstName: 'Mariam', lastName: 'Bamba', email: 'm.bamba@email.com', phone: '0808080808', specialty: 'Maquilleuse', bio: 'Maquilleuse effets spéciaux.', motivation: 'Développer mon réseau.', cvFileName: 'dossier_mariam.pdf', date: '2024-07-27T15:30:00Z', status: ApplicationStatus.APPROVED_BY_CA },
];

export const FINANCIAL_TRANSACTIONS_DATA: FinancialTransaction[] = [
    { id: 1, date: '2024-07-01', description: 'Subvention Ministère de la Culture', amount: 5000000, type: 'recette' },
    { id: 2, date: '2024-07-05', description: 'Location salle pour Masterclass', amount: -250000, type: 'dépense' },
    { id: 3, date: '2024-07-15', description: 'Cotisations membres (Juillet)', amount: 125000, type: 'recette' },
];

export const ADMIN_MESSAGES_DATA: AdminMessage[] = [
    { id: 1, senderName: 'Producteur Externe', senderEmail: 'prod@email.com', subject: 'Recherche DOP pour long métrage', message: 'Bonjour, je cherche un directeur de la photo pour un tournage en septembre.', date: '2024-07-28T14:00:00Z', read: false },
    { id: 2, senderName: 'Jeune Étudiant', senderEmail: 'etudiant@email.com', subject: 'Demande de stage', message: 'Je suis étudiant en cinéma et je cherche un stage.', date: '2024-07-27T11:00:00Z', read: true },
];

export const LIVE_EVENT_DATA: LiveEvent = {
    id: 1,
    title: "Masterclass sur la Direction Photo",
    description: "Une masterclass exclusive ouverte au public sur les techniques modernes de la direction photographique.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: 'live',
    access: { type: 'public', cost: 15000 },
};

export const LIVE_CHAT_MESSAGES: LiveChatMessage[] = [
    { id: 1, author: 'Aya K.', message: 'Bonjour à tous ! Bienvenue sur le direct.', timestamp: new Date().toISOString() },
    { id: 2, author: 'Moussa T.', message: 'Content de vous retrouver, même à distance.', timestamp: new Date().toISOString() },
];

// --- DATA FOR NEW FEATURES ---

export const EVENTS_DATA: AppEvent[] = [
    { id: 1, title: 'FESPACO 2025 - Délégation Ivoirienne', date: '2025-02-22', location: 'Ouagadougou, Burkina Faso', type: 'Festival', description: 'Départ de la délégation du RETECHCI pour le festival panafricain.' },
    { id: 2, title: 'Formation : Étalonnage DaVinci Resolve', date: '2024-09-10', location: 'Institut Français, Abidjan', type: 'Formation', description: 'Formation avancée de 3 jours pour les monteurs et étalonneurs.' },
    { id: 3, title: 'Assemblée Générale Ordinaire', date: '2024-12-15', location: 'Palais de la Culture', type: 'Réunion', description: 'Bilan annuel et vote du budget 2025.' },
];

export const FORUM_TOPICS_DATA: ForumTopic[] = [
    { id: 1, title: 'Conseils pour tournage en basse lumière avec la Sony FX6 ?', authorName: 'Jean Kouassi', authorAvatar: 'https://picsum.photos/seed/jean/50', date: '2024-08-01T10:00:00Z', category: 'Technique', repliesCount: 5, content: "Bonjour à tous, je prépare un court métrage de nuit et j'aimerais avoir vos retours sur les réglages ISO natifs..." },
    { id: 2, title: 'Recherche assistant son pour la semaine prochaine', authorName: 'Moussa Traoré', authorAvatar: 'https://picsum.photos/seed/moussa/50', date: '2024-08-02T14:00:00Z', category: 'Annonces', repliesCount: 2, content: "Salut l'équipe, j'ai besoin d'un perchman confirmé pour 3 jours de tournage à Bassam. Défraiement + Cachet." },
    { id: 3, title: 'Nouveaux tarifs syndicaux 2024', authorName: 'Aya Koné', authorAvatar: 'https://picsum.photos/seed/aya/50', date: '2024-07-25T09:00:00Z', category: 'Juridique', repliesCount: 12, content: "Voici le document récapitulatif des nouveaux tarifs négociés avec les producteurs..." },
];

// TEST DATA: Updated notifications with current date to ensure they appear as 'new'
export const NOTIFICATIONS_DATA: Notification[] = [
    { id: 101, userId: 1, message: 'TEST: CONVOCATION Bureau Exécutif ce soir.', date: new Date().toISOString(), read: false, type: 'warning', link: '/dashboard' },
    { id: 102, userId: 1, message: 'TEST: Rappel de cotisation annuelle.', date: new Date().toISOString(), read: false, type: 'warning', link: '/dashboard' },
    { id: 103, userId: 1, message: 'Nouveau message de l\'administration.', date: new Date(Date.now() - 172800000).toISOString(), read: true, type: 'info', link: '/dashboard' },
];

export const SITE_CONFIG_DATA: SiteConfig = {
  heroImageUrl: "https://images.unsplash.com/photo-1585676623395-ad1d493f968c?q=80&w=2070&auto=format&fit=crop",
  heroTitle: "Bienvenue au RETECHCI",
  heroSubtitle: "Le réseau des professionnels du cinéma et de l'audiovisuel en Côte d'Ivoire."
};
