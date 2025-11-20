// @ts-nocheck
// This file defines the database schema for the RETECHCI application.
// It serves as the single source of truth for our data structure.

// =============================================
// TABLE: Users
// Stores all member and administrator accounts.
// =============================================
const Users = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT', // Unique ID for each user
  firstName: 'TEXT NOT NULL',
  lastName: 'TEXT NOT NULL',
  email: 'TEXT NOT NULL UNIQUE', // Used for login, must be unique
  passwordHash: 'TEXT NOT NULL', // Securely hashed password, never plain text
  specialty: 'TEXT',
  avatarUrl: 'TEXT',
  availability: "TEXT CHECK(availability IN ('Disponible', 'Indisponible', 'Bientôt disponible'))",
  bio: 'TEXT',
  phone: 'TEXT',
  skills: 'TEXT', // Stored as a JSON array string: '["Skill1", "Skill2"]'
  role: "TEXT CHECK(role IN ('Directeur Exécutif', 'Président du CA', ...)) NOT NULL DEFAULT 'Membre'",
  status: "TEXT CHECK(status IN ('Membre Actif', 'Membre d\'Honneur', ...)) NOT NULL DEFAULT 'Membre Actif'",
  twoFactorEnabled: 'BOOLEAN NOT NULL DEFAULT FALSE',
  createdAt: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
};

// =============================================
// TABLE: Filmography
// Stores filmography entries for each user.
// Relationship: Many-to-One with Users (one user can have many films).
// =============================================
const Filmography = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  userId: 'INTEGER NOT NULL', // Foreign key linking to the Users table
  title: 'TEXT NOT NULL',
  year: 'INTEGER NOT NULL',
  month: 'INTEGER NOT NULL',
  role: 'TEXT NOT NULL',
  type: "TEXT CHECK(type IN ('Long Métrage', 'Série TV', ...))",
  impactScore: 'INTEGER',
  boxOffice: 'INTEGER',
  audience: 'INTEGER',
  FOREIGN_KEY: '(userId) REFERENCES Users(id) ON DELETE CASCADE', // If a user is deleted, their filmography is also deleted.
};

// =============================================
// TABLE: Applications
// Stores membership applications.
// =============================================
const Applications = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  firstName: 'TEXT NOT NULL',
  lastName: 'TEXT NOT NULL',
  email: 'TEXT NOT NULL',
  phone: 'TEXT',
  specialty: 'TEXT NOT NULL',
  bio: 'TEXT',
  motivation: 'TEXT',
  cvFileName: 'TEXT',
  date: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
  status: "TEXT CHECK(status IN ('En attente', 'Approuvée par le CA', ...)) NOT NULL DEFAULT 'En attente'",
};

// =============================================
// TABLE: Transactions
// Stores all financial transactions (revenues and expenses).
// =============================================
const Transactions = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  date: 'DATE NOT NULL',
  description: 'TEXT NOT NULL',
  amount: 'REAL NOT NULL', // REAL can store decimal values. Positive for revenue, negative for expense.
  type: "TEXT CHECK(type IN ('recette', 'dépense')) NOT NULL",
};

// =============================================
// TABLE: Messages
// Stores messages received from contact forms or the chat widget.
// =============================================
const Messages = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  senderName: 'TEXT NOT NULL',
  senderEmail: 'TEXT NOT NULL',
  subject: 'TEXT',
  message: 'TEXT NOT NULL',
  date: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
  read: 'BOOLEAN NOT NULL DEFAULT FALSE',
};

// =============================================
// TABLE: Payments
// Stores the history of membership fee payments.
// Relationship: Many-to-One with Users.
// =============================================
const Payments = {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    userId: 'INTEGER NOT NULL',
    year: 'INTEGER NOT NULL',
    amount: 'REAL NOT NULL',
    status: "TEXT CHECK(status IN ('Payée', 'Impayée')) NOT NULL",
    paymentDate: 'DATETIME',
    FOREIGN_KEY: '(userId) REFERENCES Users(id) ON DELETE CASCADE',
};
