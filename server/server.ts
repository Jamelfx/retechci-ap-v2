// @ts-nocheck
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes';

// Configuration pour les chemins dans les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3001;

// =================================================
// MIDDLEWARES
// =================================================

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(express.json());

// =================================================
// API ROUTES
// =================================================
app.use('/api', apiRoutes);

// =================================================
// FRONTEND STATIC FILES (PRODUCTION)
// =================================================
// Servir les fichiers statiques du dossier 'dist' (le build de React)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Pour toutes les autres requêtes (non-API), renvoyer l'application React (index.html)
// C'est essentiel pour que le routage React (react-router) fonctionne
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// =================================================
// DÉMARRAGE DU SERVEUR
// =================================================
app.listen(PORT, () => {
  console.log(`🚀 Serveur RETECHCI démarré sur le port ${PORT}`);
});