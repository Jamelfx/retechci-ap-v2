
export interface Film {
  title: string;
  year: number;
  month: number;
  role: string;
  type: 'Long Métrage' | 'Série TV' | 'Publicité' | 'Court Métrage' | 'Documentaire';
  impactScore: number; // 1 to 5
  boxOffice?: number; // entrées en salle
  audience?: number; // spectateurs
}

export enum Availability {
  AVAILABLE = 'Disponible',
  UNAVAILABLE = 'Indisponible',
  SOON = 'Bientôt disponible',
}

export interface Photo {
  id: number;
  url: string;
}

export interface Payment {
  id: number;
  year: number;
  amount: number;
  status: 'Payée' | 'Impayée';
  date: string; // ISO String
}

export interface Technician {
  id: number;
  name: string;
  specialty: string;
  avatarUrl: string;
  availability: Availability;
  bio: string;
  filmography: Film[];
  email: string;
  phone: string;
  skills: string[];
}

export type NotificationPreference = 'email' | 'sms' | 'none';

export type UserRole = 
  'Directeur Exécutif' | 
  'Président du CA' | 
  'Trésorière' | 
  'Membre' |
  'Secrétaire Général' |
  'Secrétaire Général Adjoint' |
  'Secrétaire à la communication' |
  'Secrétaire à la communication Adjoint' |
  'Trésorier Adjoint';

export type MemberStatus = 'Membre Actif' | 'Membre d\'Honneur' | 'Membre Bienfaiteur' | 'Sanctionné';


export interface Member extends Technician {
  membershipPaid: boolean;
  nextMeeting: string;
  notificationPreference: NotificationPreference;
  gallery: Photo[];
  paymentHistory: Payment[];
  role?: UserRole;
  status: MemberStatus;
  twoFactorEnabled: boolean;
  passwordHash: string; // NOUVEAU: pour simuler un mot de passe haché
}

export interface NewsArticle {
  id: number;
  title: string;
  date: string; // ISO String
  summary: string;
  imageUrl: string;
}

export interface Video {
  id: number;
  title: string;
  thumbnailUrl: string;
  duration: string;
  videoUrl: string; // YouTube embed URL
}

export interface SalaryCategory {
  category: 'A' | 'B' | 'C';
  description: string;
  weeklyRate: number;
}

export interface JobSalary {
  id: number;
  jobTitle: string;
  categories: SalaryCategory[];
}

// Nouvelles interfaces pour les annuaires
export interface Location {
  id: number;
  name: string;
  region: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface ShowcaseItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  creator: string;
  category: string;
}

export type Costume = ShowcaseItem;
export type Prop = ShowcaseItem;

export interface Equipment {
  id: number;
  name: string;
  category: 'Caméra' | 'Lumière' | 'Son' | 'Machinerie';
  dailyRate: number;
}

export interface RentalCompany {
  id: number;
  name: string;
  logoUrl: string;
  contact: string;
  equipment: Equipment[];
}

// Structure pour le graphique financier (agrégée)
export interface FinancialYearData {
  year: number;
  recettes: number;
  dépenses: number;
}

// Nouvelle structure pour les transactions détaillées
export interface FinancialTransaction {
  id: number;
  date: string; // ISO String 'YYYY-MM-DD'
  description: string;
  amount: number;
  type: 'recette' | 'dépense';
}

// NOUVEAU: Pour la gestion des candidatures
export enum ApplicationStatus {
  PENDING = 'En attente',
  APPROVED_BY_CA = 'Approuvée par le CA',
  INVITATION_SENT = 'Invitation envoyée',
  ACTIVATED = 'Membre Actif',
}

export interface MembershipApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  bio: string;
  motivation: string;
  cvFileName?: string;
  date: string; // ISO String
  status: ApplicationStatus;
}

// NOUVEAU: Pour la messagerie de l'administration
export interface AdminMessage {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  date: string; // ISO String
  read: boolean;
}

// NOUVEAU: Pour les partenaires
export interface Partner {
  name: string;
  logoUrl: string;
}

// NOUVEAU: Pour la retransmission en direct
export type LiveEventAccess =
  | { type: 'public'; cost: number; } // cost = 0 for free
  | { type: 'members_only'; };

export interface LiveEvent {
  id: number;
  title: string;
  description: string;
  videoUrl: string; // YouTube embed URL
  status: 'live' | 'offline';
  access: LiveEventAccess;
}


export interface LiveChatMessage {
  id: number;
  author: string;
  message: string;
  timestamp: string; // ISO String
}

// --- NOUVELLES INTERFACES POUR V2 ---

export interface ForumTopic {
  id: number;
  title: string;
  authorName: string;
  authorAvatar?: string;
  date: string;
  category: 'Matériel' | 'Juridique' | 'Technique' | 'Divers' | 'Annonces';
  repliesCount: number;
  content: string;
}

export interface AppEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  type: 'Festival' | 'Formation' | 'Réunion' | 'Autre';
  description: string;
  imageUrl?: string;
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
  link?: string;
}

export interface SiteConfig {
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
}