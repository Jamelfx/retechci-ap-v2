// @ts-nocheck
import sqlite3 from 'sqlite3';
import { Member, NewsArticle, JobSalary, Video, Location, Costume, Prop, RentalCompany, Partner, Availability, Film, FinancialTransaction, MembershipApplication, ApplicationStatus, AdminMessage, MemberStatus, UserRole } from '../types';

const DB_FILE = './retechci.db';
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) console.error("Erreur de connexion à la BDD", err.message);
});

// Helper pour parser les champs JSON
const parseJSONFields = (item, fields) => {
    if (!item) return item;
    const newItem = { ...item };
    fields.forEach(field => {
        if (newItem[field]) {
            try {
                newItem[field] = JSON.parse(newItem[field]);
            } catch (e) {
                console.error(`Erreur de parsing JSON pour le champ ${field}:`, newItem[field]);
                newItem[field] = [];
            }
        }
    });
    return newItem;
};

// Helper pour les requêtes SELECT
const dbAll = (query, params = []) => new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
});

// Helper pour les requêtes SELECT (un seul résultat)
const dbGet = (query, params = []) => new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
    });
});

// Helper pour les requêtes INSERT, UPDATE, DELETE
const dbRun = (query, params = []) => new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
    });
});


// --- Fonctions de lecture ---

export const dbGetAllTechnicians = async (): Promise<Member[]> => {
    const users = await dbAll('SELECT * FROM users');
    return users.map(user => parseJSONFields(user, ['skills', 'filmography', 'gallery', 'paymentHistory']));
};
export const dbGetAllNews = async (): Promise<NewsArticle[]> => dbAll('SELECT * FROM news');
export const dbGetAllVideos = async (): Promise<Video[]> => dbAll('SELECT * FROM videos');
export const dbGetAllPartners = async (): Promise<Partner[]> => dbAll('SELECT * FROM partners');
export const dbGetAllLocations = async (): Promise<Location[]> => {
    const locations = await dbAll('SELECT * FROM locations');
    return locations.map(loc => parseJSONFields(loc, ['tags']));
};
export const dbGetAllCostumes = async (): Promise<Costume[]> => dbAll('SELECT * FROM costumes');
export const dbGetAllProps = async (): Promise<Prop[]> => dbAll('SELECT * FROM props');
export const dbGetAllEquipment = async (): Promise<RentalCompany[]> => {
    const companies = await dbAll('SELECT * FROM rental_companies');
    return companies.map(c => parseJSONFields(c, ['equipment']));
};
export const dbGetAllSalaries = async (): Promise<JobSalary[]> => {
    const salaries = await dbAll('SELECT * FROM salaries');
    return salaries.map(s => parseJSONFields(s, ['categories']));
};
export const dbGetAdminApplications = async (): Promise<MembershipApplication[]> => dbAll('SELECT * FROM applications ORDER BY date DESC');
export const dbGetAdminTransactions = async (): Promise<FinancialTransaction[]> => dbAll('SELECT * FROM transactions ORDER BY date DESC');
export const dbGetAdminMessages = async (): Promise<AdminMessage[]> => dbAll('SELECT * FROM messages ORDER BY date DESC');

// --- Fonctions de modification ---

export const dbLoginUser = async (email: string, password?: string): Promise<Member | null> => {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    return parseJSONFields(user, ['skills', 'filmography', 'gallery', 'paymentHistory']);
};

const getSingleUser = async (userId) => {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    return parseJSONFields(user, ['skills', 'filmography', 'gallery', 'paymentHistory']);
}

export const dbUpdateUserAvailability = async (userId: number, availability: Availability): Promise<Member | null> => {
    await dbRun('UPDATE users SET availability = ? WHERE id = ?', [availability, userId]);
    return getSingleUser(userId);
};

export const dbAddUserFilm = async (userId: number, film: Film): Promise<Member | null> => {
    const user = await getSingleUser(userId);
    if (user) {
        const newFilmography = [...user.filmography, film];
        await dbRun('UPDATE users SET filmography = ? WHERE id = ?', [JSON.stringify(newFilmography), userId]);
        return getSingleUser(userId);
    }
    return null;
};

export const dbRemoveUserFilm = async (userId: number, filmIndex: number): Promise<Member | null> => {
    const user = await getSingleUser(userId);
    if (user && user.filmography[filmIndex]) {
        const newFilmography = user.filmography.filter((_, index) => index !== filmIndex);
        await dbRun('UPDATE users SET filmography = ? WHERE id = ?', [JSON.stringify(newFilmography), userId]);
        return getSingleUser(userId);
    }
    return null;
};

export const dbUpdateUserAvatar = async (userId: number, avatarUrl: string): Promise<Member | null> => {
    await dbRun('UPDATE users SET avatarUrl = ? WHERE id = ?', [avatarUrl, userId]);
    return getSingleUser(userId);
};

export const dbAddUserPhoto = async (userId: number, photoUrl: string): Promise<Member | null> => {
    const user = await getSingleUser(userId);
    if (user) {
        const newGallery = [...user.gallery, { id: Date.now(), url: photoUrl }];
        await dbRun('UPDATE users SET gallery = ? WHERE id = ?', [JSON.stringify(newGallery), userId]);
        return getSingleUser(userId);
    }
    return null;
};

export const dbRemoveUserPhoto = async (userId: number, photoId: number): Promise<Member | null> => {
    const user = await getSingleUser(userId);
    if (user) {
        const newGallery = user.gallery.filter(p => p.id !== photoId);
        await dbRun('UPDATE users SET gallery = ? WHERE id = ?', [JSON.stringify(newGallery), userId]);
        return getSingleUser(userId);
    }
    return null;
};

export const dbUpdateUserPassword = async (userId: number): Promise<void> => { /* Logic with hashing would go here */ };
export const dbUpdateUser2FA = async (userId: number, enabled: boolean): Promise<Member | null> => {
    await dbRun('UPDATE users SET twoFactorEnabled = ? WHERE id = ?', [enabled ? 1 : 0, userId]);
    return getSingleUser(userId);
};

export const dbUpdateUserPayment = async (userId: number, year: number): Promise<Member | null> => {
    const user = await getSingleUser(userId);
    if (user) {
        const newPaymentHistory = user.paymentHistory.map(p => p.year === year ? { ...p, status: 'Payée', date: new Date().toISOString() } : p);
        await dbRun('UPDATE users SET paymentHistory = ? WHERE id = ?', [JSON.stringify(newPaymentHistory), userId]);
        return getSingleUser(userId);
    }
    return null;
};

export const dbAddMessage = async (message: Omit<AdminMessage, 'id' | 'date' | 'read'>): Promise<AdminMessage[]> => {
    await dbRun('INSERT INTO messages (senderName, senderEmail, subject, message, date, read) VALUES (?, ?, ?, ?, ?, ?)', [message.senderName, message.senderEmail, message.subject, message.message, new Date().toISOString(), 0]);
    return dbGetAdminMessages();
};

export const dbAddApplication = async (app: Omit<MembershipApplication, 'id' | 'date' | 'status'>): Promise<MembershipApplication[]> => {
    await dbRun('INSERT INTO applications (firstName, lastName, email, phone, specialty, bio, motivation, cvFileName, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [app.firstName, app.lastName, app.email, app.phone, app.specialty, app.bio, app.motivation, app.cvFileName, new Date().toISOString(), ApplicationStatus.PENDING]);
    return dbGetAdminApplications();
}

// Admin actions
export const dbApproveApplication = async (appId: number): Promise<MembershipApplication[]> => {
    await dbRun('UPDATE applications SET status = ? WHERE id = ?', [ApplicationStatus.APPROVED_BY_CA, appId]);
    return dbGetAdminApplications();
};

export const dbInviteApplication = async (appId: number): Promise<MembershipApplication[]> => {
    await dbRun('UPDATE applications SET status = ? WHERE id = ?', [ApplicationStatus.INVITATION_SENT, appId]);
    return dbGetAdminApplications();
};

export const dbActivateApplication = async (appId: number): Promise<{ members: Member[], applications: MembershipApplication[] }> => {
    const app = await dbGet('SELECT * FROM applications WHERE id = ?', [appId]);
    if (app) {
        const newMemberData = {
            name: `${app.firstName} ${app.lastName}`,
            specialty: app.specialty,
            avatarUrl: `https://picsum.photos/seed/${app.firstName}${app.lastName}/400/400`,
            availability: Availability.AVAILABLE,
            bio: app.bio,
            filmography: JSON.stringify([]),
            email: app.email.toLowerCase(),
            phone: app.phone,
            skills: JSON.stringify([]),
            membershipPaid: false,
            nextMeeting: '',
            notificationPreference: 'email',
            gallery: JSON.stringify([]),
            paymentHistory: JSON.stringify([{ id: Date.now(), year: new Date().getFullYear(), amount: 25000, status: 'Impayée', date: new Date().toISOString() }]),
            role: 'Membre',
            status: 'Membre Actif',
            twoFactorEnabled: false,
        };
        
        const columns = Object.keys(newMemberData).join(', ');
        const placeholders = Object.keys(newMemberData).map(() => '?').join(', ');

        await dbRun(`INSERT INTO users (${columns}) VALUES (${placeholders})`, Object.values(newMemberData));
        await dbRun('UPDATE applications SET status = ? WHERE id = ?', [ApplicationStatus.ACTIVATED, appId]);
    }
    const members = await dbGetAllTechnicians();
    const applications = await dbGetAdminApplications();
    return { members, applications };
};

export const dbSanctionMember = async (memberId: number): Promise<Member[]> => {
    await dbRun('UPDATE users SET status = ? WHERE id = ?', ['Sanctionné', memberId]);
    return dbGetAllTechnicians();
};

export const dbUpdateMemberStatus = async (memberId: number, status: MemberStatus): Promise<Member[]> => {
    await dbRun('UPDATE users SET status = ? WHERE id = ?', [status, memberId]);
    return dbGetAllTechnicians();
};

export const dbUpdateMemberRole = async (memberId: number, role: UserRole): Promise<Member[]> => {
    await dbRun('UPDATE users SET role = ? WHERE id = ?', [role, memberId]);
    return dbGetAllTechnicians();
};

export const dbAddTransaction = async (tx: Omit<FinancialTransaction, 'id'>): Promise<FinancialTransaction[]> => {
    await dbRun('INSERT INTO transactions (date, description, amount, type) VALUES (?, ?, ?, ?)', [tx.date, tx.description, tx.amount, tx.type]);
    return dbGetAdminTransactions();
};

export const dbMarkMessageAsRead = async (messageId: number): Promise<AdminMessage[]> => {
    await dbRun('UPDATE messages SET read = 1 WHERE id = ?', [messageId]);
    return dbGetAdminMessages();
};