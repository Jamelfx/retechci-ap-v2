// @ts-nocheck
import sqlite3 from 'sqlite3';
import { TECHNICIANS_DATA } from '../constants';
import { NewsArticle, Video, Partner, Location, Costume, Prop, RentalCompany, JobSalary } from '../types';

// Données statiques qui ne sont pas dans constants.ts
const NEWS_DATA: NewsArticle[] = [
  { id: 1, title: "Masterclass Exceptionnelle avec le réalisateur Philippe Lacôte", date: "2024-07-20T10:00:00Z", summary: "Le RETECHCI a eu l'honneur d'organiser une masterclass exclusive avec le célèbre réalisateur ivoirien Philippe Lacôte.", imageUrl: "https://picsum.photos/seed/news1/800/600" },
  { id: 2, title: "Partenariat Stratégique avec le Festival 'Clap Ivoire'", date: "2024-07-15T15:30:00Z", summary: "Un accord historique a été signé entre le RETECHCI et le festival Clap Ivoire pour la promotion de nos membres.", imageUrl: "https://picsum.photos/seed/news2/800/600" },
];
const VIDEOS_DATA: Video[] = [ { id: 1, title: "Masterclass avec Philippe Lacôte : Les Coulisses", thumbnailUrl: "https://picsum.photos/seed/video1/400/300", duration: "12:34", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" } ];
const PARTNERS_DATA: Partner[] = [ { name: 'Canal+', logoUrl: 'https://logo.clearbit.com/canalplus.com' } ];
const LOCATIONS_DATA: Location[] = [ { id: 1, name: 'Plage de Grand-Bassam', region: 'Comoe', description: 'Vaste plage de sable fin bordée de cocotiers.', imageUrl: 'https://picsum.photos/seed/bassam/600/400', tags: ['Plage', 'Historique'] } ];
const COSTUMES_DATA: Costume[] = [ { id: 1, name: 'Tenue Royale Akan', description: 'Ensemble Kente tissé à la main.', creator: 'Atelier Kente d\'Or', imageUrl: 'https://picsum.photos/seed/kente/400/500', category: 'Traditionnel' } ];
const PROPS_DATA: Prop[] = [ { id: 1, name: 'Tabouret Akan Royal', description: 'Siège en bois sculpté, symbole de pouvoir.', creator: 'Artisan de Koumassi', imageUrl: 'https://picsum.photos/seed/tabouret/400/400', category: 'Historique' } ];
const RENTAL_COMPANIES_DATA: RentalCompany[] = [ { id: 1, name: 'Ivoire Ciné Matos', logoUrl: 'https://picsum.photos/seed/logo1/200/200', contact: 'contact@ivoirecinematos.ci', equipment: [ { id: 1, name: 'RED Komodo 6K', category: 'Caméra', dailyRate: 150000 } ] } ];
const SALARY_DATA: JobSalary[] = [ { id: 1, jobTitle: 'Directeur de production', categories: [ { category: 'A', description: 'Moins de 3 ans', weeklyRate: 400000 }, { category: 'B', description: '3 à 7 ans', weeklyRate: 600000 }, { category: 'C', description: 'Plus de 7 ans', weeklyRate: 850000 } ] } ];


const DB_FILE = './retechci.db';

const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Connecté à la base de données SQLite.');
    initializeDatabase();
});

const initializeDatabase = () => {
    db.serialize(() => {
        console.log("Création des tables...");

        // Table Users (Membres)
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            specialty TEXT,
            avatarUrl TEXT,
            availability TEXT,
            bio TEXT,
            filmography TEXT,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            skills TEXT,
            membershipPaid BOOLEAN,
            nextMeeting TEXT,
            notificationPreference TEXT,
            gallery TEXT,
            paymentHistory TEXT,
            role TEXT,
            status TEXT,
            twoFactorEnabled BOOLEAN
        )`);

        // Tables pour les données publiques
        db.run(`CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY, title TEXT, date TEXT, summary TEXT, imageUrl TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS videos (id INTEGER PRIMARY KEY, title TEXT, thumbnailUrl TEXT, duration TEXT, videoUrl TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS partners (name TEXT PRIMARY KEY, logoUrl TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY, name TEXT, region TEXT, description TEXT, imageUrl TEXT, tags TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS costumes (id INTEGER PRIMARY KEY, name TEXT, description TEXT, imageUrl TEXT, creator TEXT, category TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS props (id INTEGER PRIMARY KEY, name TEXT, description TEXT, imageUrl TEXT, creator TEXT, category TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS rental_companies (id INTEGER PRIMARY KEY, name TEXT, logoUrl TEXT, contact TEXT, equipment TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS salaries (id INTEGER PRIMARY KEY, jobTitle TEXT, categories TEXT)`);
        
        // Tables pour l'administration
        db.run(`CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, email TEXT, phone TEXT, specialty TEXT, bio TEXT, motivation TEXT, cvFileName TEXT, date TEXT, status TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, description TEXT, amount REAL, type TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, senderName TEXT, senderEmail TEXT, subject TEXT, message TEXT, date TEXT, read BOOLEAN)`);

        console.log("Tables créées ou déjà existantes.");
        
        // Insertion des données si les tables sont vides
        seedData();
    });
};

const seedData = () => {
    console.log("Vérification et insertion des données de départ...");

    const seedTable = (tableName, data, insertStatement) => {
        db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
            if (err) return console.error(`Erreur de comptage ${tableName}`, err);
            if (row.count === 0) {
                console.log(`Insertion des données pour la table ${tableName}...`);
                const stmt = db.prepare(insertStatement);
                data.forEach(item => {
                    const params = Object.values(item).map(val => typeof val === 'object' ? JSON.stringify(val) : val);
                    stmt.run(params);
                });
                stmt.finalize();
                console.log(`${tableName} rempli avec succès.`);
            } else {
                console.log(`La table ${tableName} contient déjà des données.`);
            }
        });
    };

    seedTable('users', TECHNICIANS_DATA, `INSERT INTO users (id, name, specialty, avatarUrl, availability, bio, filmography, email, phone, skills, membershipPaid, nextMeeting, notificationPreference, gallery, paymentHistory, role, status, twoFactorEnabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    seedTable('news', NEWS_DATA, `INSERT INTO news (id, title, date, summary, imageUrl) VALUES (?, ?, ?, ?, ?)`);
    seedTable('videos', VIDEOS_DATA, `INSERT INTO videos (id, title, thumbnailUrl, duration, videoUrl) VALUES (?, ?, ?, ?, ?)`);
    seedTable('partners', PARTNERS_DATA, `INSERT INTO partners (name, logoUrl) VALUES (?, ?)`);
    seedTable('locations', LOCATIONS_DATA, `INSERT INTO locations (id, name, region, description, imageUrl, tags) VALUES (?, ?, ?, ?, ?, ?)`);
    seedTable('costumes', COSTUMES_DATA, `INSERT INTO costumes (id, name, description, imageUrl, creator, category) VALUES (?, ?, ?, ?, ?, ?)`);
    seedTable('props', PROPS_DATA, `INSERT INTO props (id, name, description, imageUrl, creator, category) VALUES (?, ?, ?, ?, ?, ?)`);
    seedTable('rental_companies', RENTAL_COMPANIES_DATA, `INSERT INTO rental_companies (id, name, logoUrl, contact, equipment) VALUES (?, ?, ?, ?, ?)`);
    seedTable('salaries', SALARY_DATA, `INSERT INTO salaries (id, jobTitle, categories) VALUES (?, ?, ?)`);

    // Fermeture de la connexion après un délai pour s'assurer que tout est écrit
    setTimeout(() => {
        db.close((err) => {
            if (err) return console.error(err.message);
            console.log('Connexion à la base de données fermée.');
        });
    }, 2000);
};