import {
    Member, NewsArticle, JobSalary, Video, Location, Costume, Prop, RentalCompany, Partner, Availability, Film,
    FinancialTransaction, MembershipApplication, ApplicationStatus, AdminMessage, MemberStatus, UserRole,
    LiveEvent, LiveChatMessage
} from '../types';

import {
    TECHNICIANS_DATA, NEWS_DATA, VIDEOS_DATA, PARTNERS_DATA, LOCATIONS_DATA, COSTUMES_DATA, PROPS_DATA,
    RENTAL_COMPANIES_DATA, SALARY_DATA, MEMBERSHIP_APPLICATIONS_DATA, FINANCIAL_TRANSACTIONS_DATA, ADMIN_MESSAGES_DATA,
    LIVE_EVENT_DATA, LIVE_CHAT_MESSAGES
} from './mock-data';

// Initialize in-memory store with deep copies to prevent mutation of original constants
let members: Member[] = JSON.parse(JSON.stringify(TECHNICIANS_DATA));
let news: NewsArticle[] = JSON.parse(JSON.stringify(NEWS_DATA));
let videos: Video[] = JSON.parse(JSON.stringify(VIDEOS_DATA));
let partners: Partner[] = JSON.parse(JSON.stringify(PARTNERS_DATA));
let locations: Location[] = JSON.parse(JSON.stringify(LOCATIONS_DATA));
let costumes: Costume[] = JSON.parse(JSON.stringify(COSTUMES_DATA));
let props: Prop[] = JSON.parse(JSON.stringify(PROPS_DATA));
let equipment: RentalCompany[] = JSON.parse(JSON.stringify(RENTAL_COMPANIES_DATA));
let salaries: JobSalary[] = JSON.parse(JSON.stringify(SALARY_DATA));
let applications: MembershipApplication[] = JSON.parse(JSON.stringify(MEMBERSHIP_APPLICATIONS_DATA));
let transactions: FinancialTransaction[] = JSON.parse(JSON.stringify(FINANCIAL_TRANSACTIONS_DATA));
let messages: AdminMessage[] = JSON.parse(JSON.stringify(ADMIN_MESSAGES_DATA));
let liveEvent: LiveEvent = JSON.parse(JSON.stringify(LIVE_EVENT_DATA));
let liveChatMessages: LiveChatMessage[] = JSON.parse(JSON.stringify(LIVE_CHAT_MESSAGES));


const resolve = <T>(data: T): Promise<T> => Promise.resolve(data);

// --- Read operations ---
export const dbGetAllTechnicians = () => resolve(members);
export const dbGetAllNews = () => resolve(news);
export const dbGetAllVideos = () => resolve(videos);
export const dbGetAllPartners = () => resolve(partners);
export const dbGetAllLocations = () => resolve(locations);
export const dbGetAllCostumes = () => resolve(costumes);
export const dbGetAllProps = () => resolve(props);
export const dbGetAllEquipment = () => resolve(equipment);
export const dbGetAllSalaries = () => resolve(salaries);
export const dbGetAdminApplications = () => resolve(applications);
export const dbGetAdminTransactions = () => resolve(transactions);
export const dbGetAdminMessages = () => resolve(messages);
export const dbGetLiveEvent = () => resolve(liveEvent);
export const dbGetLiveChatMessages = () => resolve(liveChatMessages);


// --- Write operations ---

// Simulates password hashing and checking
const simulateHash = (password: string) => `hashed_${password}`;
const checkPassword = (password: string, hash: string) => simulateHash(password) === hash;

export const dbLoginUser = (email: string, password?: string): Promise<{user: Member, token: string} | null> => {
    const user = members.find(m => m.email.toLowerCase() === email.toLowerCase());
    
    // For social login, we bypass password check but still require the user to exist
    if (user && password === 'social_login_dummy_password') {
         return resolve({ user, token: `token_for_user_${user.id}` });
    }
    
    if (user && password && checkPassword(password, user.passwordHash)) {
        return resolve({ user, token: `token_for_user_${user.id}` });
    }

    return resolve(null);
};

export const dbGetUserFromToken = (token: string): Promise<Member | null> => {
    const userIdMatch = token.match(/^token_for_user_(\d+)$/);
    if (userIdMatch) {
        const userId = parseInt(userIdMatch[1]);
        const user = members.find(m => m.id === userId);
        return resolve(user || null);
    }
    return resolve(null);
}


const getSingleUser = (userId: number) => members.find(m => m.id === userId);

export const dbUpdateUserAvailability = (userId: number, availability: Availability): Promise<Member | null> => {
    const member = getSingleUser(userId);
    if (member) member.availability = availability;
    return resolve(member || null);
};

export const dbAddUserFilm = (userId: number, film: Film): Promise<Member | null> => {
    const member = getSingleUser(userId);
    if (member) member.filmography.push(film);
    return resolve(member || null);
};

export const dbRemoveUserFilm = (userId: number, filmIndex: number): Promise<Member | null> => {
    const member = getSingleUser(userId);
    if (member && member.filmography[filmIndex]) {
        member.filmography.splice(filmIndex, 1);
    }
    return resolve(member || null);
};

export const dbUpdateUserAvatar = (userId: number, avatarUrl: string): Promise<Member | null> => {
    const member = getSingleUser(userId);
    if (member) member.avatarUrl = avatarUrl;
    return resolve(member || null);
};

export const dbAddUserPhoto = (userId: number, photoUrl: string): Promise<Member | null> => {
    const member = getSingleUser(userId);
    if (member) member.gallery.push({ id: Date.now(), url: photoUrl });
    return resolve(member || null);
};

export const dbRemoveUserPhoto = (userId: number, photoId: number): Promise<Member | null> => {
    const member = getSingleUser(userId);
    if (member) member.gallery = member.gallery.filter(p => p.id !== photoId);
    return resolve(member || null);
};

export const dbUpdateUserPassword = (userId: number, oldPassword?: string, newPassword?: string): Promise<void> => {
    const member = getSingleUser(userId);
    if (member && oldPassword && newPassword) {
        if (checkPassword(oldPassword, member.passwordHash)) {
            member.passwordHash = simulateHash(newPassword);
            return resolve(undefined);
        } else {
            return Promise.reject(new Error("L'ancien mot de passe est incorrect."));
        }
    }
    return Promise.reject(new Error("Données invalides pour le changement de mot de passe."));
};

export const dbUpdateUser2FA = (userId: number, enabled: boolean): Promise<Member | null> => {
    const member = getSingleUser(userId);
    if (member) member.twoFactorEnabled = enabled;
    return resolve(member || null);
};

export const dbUpdateUserPayment = (userId: number, year: number): Promise<Member | null> => {
    const member = getSingleUser(userId);
    if (member) {
        const payment = member.paymentHistory.find(p => p.year === year);
        if (payment) {
            payment.status = 'Payée';
            payment.date = new Date().toISOString();
        }
    }
    return resolve(member || null);
};

export const dbAddMessage = (message: Omit<AdminMessage, 'id' | 'date' | 'read'>): Promise<AdminMessage[]> => {
    const newMessage: AdminMessage = { ...message, id: Date.now(), date: new Date().toISOString(), read: false };
    messages.push(newMessage);
    return resolve(messages);
};

export const dbAddApplication = (app: Omit<MembershipApplication, 'id' | 'date' | 'status'>): Promise<MembershipApplication[]> => {
    const newApp: MembershipApplication = { ...app, id: Date.now(), date: new Date().toISOString(), status: ApplicationStatus.PENDING };
    applications.push(newApp);
    return resolve(applications);
};

export const dbApproveApplication = (appId: number): Promise<MembershipApplication[]> => {
    const app = applications.find(a => a.id === appId);
    if (app) app.status = ApplicationStatus.APPROVED_BY_CA;
    return resolve(applications);
};

export const dbInviteApplication = (appId: number): Promise<MembershipApplication[]> => {
    const app = applications.find(a => a.id === appId);
    if (app) app.status = ApplicationStatus.INVITATION_SENT;
    return resolve(applications);
};

export const dbActivateApplication = (appId: number): Promise<{ members: Member[], applications: MembershipApplication[] }> => {
    const appIndex = applications.findIndex(a => a.id === appId);
    if (appIndex > -1) {
        const app = applications[appIndex];
        const newMember: Member = {
            id: Date.now(),
            name: `${app.firstName} ${app.lastName}`,
            specialty: app.specialty,
            avatarUrl: `https://picsum.photos/seed/${app.firstName}${app.lastName}/400/400`,
            availability: Availability.AVAILABLE,
            bio: app.bio,
            filmography: [],
            email: app.email.toLowerCase(),
            phone: app.phone,
            skills: [],
            membershipPaid: false,
            nextMeeting: '',
            notificationPreference: 'email',
            gallery: [],
            paymentHistory: [{ id: Date.now(), year: new Date().getFullYear(), amount: 25000, status: 'Impayée', date: new Date().toISOString() }],
            role: 'Membre',
            status: 'Membre Actif',
            twoFactorEnabled: false,
            passwordHash: simulateHash('password123'), // Default password for new members
        };
        members.push(newMember);
        app.status = ApplicationStatus.ACTIVATED;
    }
    return resolve({ members, applications });
};

export const dbAddSpecialMember = (data: { firstName: string, lastName: string, email: string, specialty: string, status: 'Membre d\'Honneur' | 'Membre Bienfaiteur' }): Promise<Member[]> => {
    const existing = members.find(m => m.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
        return Promise.reject(new Error("Un membre avec cet email existe déjà."));
    }
    const newMember: Member = {
        id: Date.now(),
        name: `${data.firstName} ${data.lastName}`,
        email: data.email.toLowerCase(),
        specialty: data.specialty,
        status: data.status,
        role: 'Membre',
        passwordHash: simulateHash('password123'), // Default password
        avatarUrl: `https://picsum.photos/seed/${data.firstName}${data.lastName}/400/400`,
        availability: Availability.AVAILABLE,
        bio: 'Profil créé par l\'administration.',
        filmography: [],
        phone: '',
        skills: [],
        membershipPaid: true,
        nextMeeting: '',
        notificationPreference: 'email',
        gallery: [],
        paymentHistory: [],
        twoFactorEnabled: false,
    };
    members.push(newMember);
    return resolve(members);
};

export const dbSanctionMember = (memberId: number): Promise<Member[]> => {
    const member = getSingleUser(memberId);
    if (member) member.status = 'Sanctionné';
    return resolve(members);
};

export const dbUpdateMemberStatus = (memberId: number, status: MemberStatus): Promise<Member[]> => {
    const member = getSingleUser(memberId);
    if (member) member.status = status;
    return resolve(members);
};

export const dbUpdateMemberRole = (memberId: number, role: UserRole): Promise<Member[]> => {
    const member = getSingleUser(memberId);
    if (member) member.role = role;
    return resolve(members);
};

export const dbAddTransaction = (tx: Omit<FinancialTransaction, 'id'>): Promise<FinancialTransaction[]> => {
    const newTx: FinancialTransaction = { ...tx, id: Date.now() };
    transactions.push(newTx);
    return resolve(transactions);
};

export const dbMarkMessageAsRead = (messageId: number): Promise<AdminMessage[]> => {
    const message = messages.find(m => m.id === messageId);
    if (message) message.read = true;
    return resolve(messages);
};

export const dbUpdateLiveEvent = (updates: Partial<LiveEvent>): Promise<LiveEvent> => {
    // Make sure to handle the nested 'access' object correctly
    if (updates.access) {
      liveEvent = { ...liveEvent, ...updates, access: { ...liveEvent.access, ...updates.access } };
    } else {
      liveEvent = { ...liveEvent, ...updates };
    }
    // If the main update contains a fully formed access object, this will also work fine.
    // The client sends the whole `liveEventForm` object, so this is robust.
    return resolve(liveEvent);
};