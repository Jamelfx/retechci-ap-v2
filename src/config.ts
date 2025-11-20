
// src/config.ts

// On regarde si une URL d'API spécifique a été définie dans les variables d'environnement (ex: sur Netlify pour pointer vers Render)
// Si VITE_API_URL est définie, on l'utilise.
// Sinon, si on est en PROD (Netlify), on laisse vide (ce qui déclenchera le mode Mock dans api/client.ts).
// Si on est en DEV local, on pointe vers le serveur local.

const envApiUrl = (import.meta as any).env.VITE_API_URL;
const isProduction = (import.meta as any).env.PROD;

export const API_URL: string = envApiUrl || (isProduction ? '' : 'http://localhost:3001');
