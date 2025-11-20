
import { API_URL } from '../config';
import * as mockDb from './mock-db';
import { Film, Availability, MemberStatus, UserRole, FinancialTransaction, MembershipApplication, AdminMessage, LiveEvent, ForumTopic } from '../types/types';

// This file simulates or connects to a REST API client.
// It allows the frontend to be developed independently of a live backend.

const TOKEN_KEY = 'retechci_auth_token';

interface ApiClient {
  get(path: string): Promise<any>;
  post(path: string, data: any): Promise<any>;
  put(path: string, data: any): Promise<any>;
  delete(path: string): Promise<any>;
}

// --- MOCK API CLIENT (for local development) ---
const mockApiClient: ApiClient = {
  async get(path: string): Promise<any> {
    console.log(`[MOCK API] GET ${path}`);
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay

    if (path === '/api/auth/me') {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            return mockDb.dbGetUserFromToken(token);
        }
        throw new Error('No active session.');
    }

    if (path === '/api/notifications') {
         const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            const user = await mockDb.dbGetUserFromToken(token);
            if(user) return mockDb.dbGetNotifications(user.id);
        }
        return [];
    }

    // Public routes don't need a token
    switch (path) {
      case '/api/config':
        return mockDb.dbGetSiteConfig();
      case '/api/technicians':
        return mockDb.dbGetAllTechnicians();
      case '/api/news':
        return mockDb.dbGetAllNews();
      case '/api/videos':
        return mockDb.dbGetAllVideos();
      case '/api/partners':
        return mockDb.dbGetAllPartners();
      case '/api/locations':
        return mockDb.dbGetAllLocations();
      case '/api/costumes':
        return mockDb.dbGetAllCostumes();
      case '/api/props':
        return mockDb.dbGetAllProps();
      case '/api/equipment':
        return mockDb.dbGetAllEquipment();
      case '/api/salaries':
        return mockDb.dbGetAllSalaries();
      case '/api/live/event':
        return mockDb.dbGetLiveEvent();
      case '/api/live/chat':
        return mockDb.dbGetLiveChatMessages();
      case '/api/events':
        return mockDb.dbGetEvents();
      case '/api/forum/topics':
        return mockDb.dbGetForumTopics();
      case '/api/admin/applications':
        return mockDb.dbGetAdminApplications();
      case '/api/admin/transactions':
        return mockDb.dbGetAdminTransactions();
      case '/api/admin/messages':
        return mockDb.dbGetAdminMessages();
      default:
        throw new Error(`[MOCK API] Unhandled GET path: ${path}`);
    }
  },

  async post(path: string, data: any): Promise<any> {
    console.log(`[MOCK API] POST ${path}`, data);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

    if (path === '/api/auth/login') {
      const result = await mockDb.dbLoginUser(data.email, data.password);
      if (result) {
        localStorage.setItem(TOKEN_KEY, result.token);
        return result;
      }
      throw new Error('Email ou mot de passe incorrect.');
    }
    
    if (path === '/api/auth/logout') {
        localStorage.removeItem(TOKEN_KEY);
        return Promise.resolve({ message: 'Logged out' });
    }

    const userFilmographyRegex = /^\/api\/users\/(\d+)\/filmography$/;
    const userGalleryRegex = /^\/api\/users\/(\d+)\/gallery$/;
    let match;

    if (path === '/api/messages') {
        return mockDb.dbAddMessage(data as Omit<AdminMessage, 'id'|'date'|'read'>);
    }
    if (path === '/api/applications') {
        return mockDb.dbAddApplication(data as Omit<MembershipApplication, 'id'|'date'|'status'>);
    }
    if (match = path.match(userFilmographyRegex)) {
        const userId = parseInt(match[1]);
        return mockDb.dbAddUserFilm(userId, data.film as Film);
    }
    if (match = path.match(userGalleryRegex)) {
        const userId = parseInt(match[1]);
        return mockDb.dbAddUserPhoto(userId, data.photoUrl as string);
    }
     if (path.startsWith('/api/admin/applications/')) {
        const parts = path.split('/');
        const appId = parseInt(parts[4]);
        return mockDb.dbActivateApplication(appId);
    }
    if (path === '/api/admin/transactions') {
        return mockDb.dbAddTransaction(data as Omit<FinancialTransaction, 'id'>);
    }
    if (path === '/api/admin/members') {
        return mockDb.dbAddSpecialMember(data);
    }
    if (path === '/api/forum/topics') {
        return mockDb.dbCreateForumTopic(data as Omit<ForumTopic, 'id'|'repliesCount'|'date'>);
    }

    throw new Error(`[MOCK API] Unhandled POST path: ${path}`);
  },

  async put(path: string, data: any): Promise<any> {
    console.log(`[MOCK API] PUT ${path}`, data);
    await new Promise(resolve => setTimeout(resolve, 300));

    const userAvailabilityRegex = /^\/api\/users\/(\d+)\/availability$/;
    const userAvatarRegex = /^\/api\/users\/(\d+)\/avatar$/;
    const user2faRegex = /^\/api\/users\/(\d+)\/2fa$/;
    const userPaymentRegex = /^\/api\/users\/(\d+)\/payment$/;
    const userPasswordRegex = /^\/api\/users\/(\d+)\/password$/;
    
    const approveAppRegex = /^\/api\/admin\/applications\/(\d+)\/approve$/;
    const inviteAppRegex = /^\/api\/admin\/applications\/(\d+)\/invite$/;
    const sanctionMemberRegex = /^\/api\/admin\/members\/(\d+)\/sanction$/;
    const statusMemberRegex = /^\/api\/admin\/members\/(\d+)\/status$/;
    const roleMemberRegex = /^\/api\/admin\/members\/(\d+)\/role$/;
    const readMessageRegex = /^\/api\/admin\/messages\/(\d+)\/read$/;
    const readNotifRegex = /^\/api\/notifications\/(\d+)\/read$/;
    
    let match;
    
    if (path === '/api/admin/config') {
        return mockDb.dbUpdateSiteConfig(data);
    }
    if (path === '/api/admin/live-event') {
        return mockDb.dbUpdateLiveEvent(data as Partial<LiveEvent>);
    }
    if (match = path.match(userAvailabilityRegex)) {
      return mockDb.dbUpdateUserAvailability(parseInt(match[1]), data.availability as Availability);
    }
    if (match = path.match(userAvatarRegex)) {
        return mockDb.dbUpdateUserAvatar(parseInt(match[1]), data.avatarUrl);
    }
    if (match = path.match(user2faRegex)) {
        return mockDb.dbUpdateUser2FA(parseInt(match[1]), data.enabled);
    }
    if (match = path.match(userPaymentRegex)) {
        return mockDb.dbUpdateUserPayment(parseInt(match[1]), data.year);
    }
    if (match = path.match(userPasswordRegex)) {
        return mockDb.dbUpdateUserPassword(parseInt(match[1]), data.oldPassword, data.newPassword);
    }
    if (match = path.match(approveAppRegex)) {
        return mockDb.dbApproveApplication(parseInt(match[1]));
    }
    if (match = path.match(inviteAppRegex)) {
        return mockDb.dbInviteApplication(parseInt(match[1]));
    }
    if (match = path.match(sanctionMemberRegex)) {
        return mockDb.dbSanctionMember(parseInt(match[1]));
    }
    if (match = path.match(statusMemberRegex)) {
        return mockDb.dbUpdateMemberStatus(parseInt(match[1]), data.status as MemberStatus);
    }
    if (match = path.match(roleMemberRegex)) {
        return mockDb.dbUpdateMemberRole(parseInt(match[1]), data.role as UserRole);
    }
    if (match = path.match(readMessageRegex)) {
        return mockDb.dbMarkMessageAsRead(parseInt(match[1]));
    }
    if (match = path.match(readNotifRegex)) {
        return mockDb.dbMarkNotificationRead(parseInt(match[1]));
    }

    throw new Error(`[MOCK API] Unhandled PUT path: ${path}`);
  },

  async delete(path: string): Promise<any> {
    console.log(`[MOCK API] DELETE ${path}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userFilmographyRegex = /^\/api\/users\/(\d+)\/filmography\/(\d+)$/;
    const userGalleryRegex = /^\/api\/users\/(\d+)\/gallery\/(\d+)$/;
    let match;

    if (match = path.match(userFilmographyRegex)) {
        const userId = parseInt(match[1]);
        const filmIndex = parseInt(match[2]);
        return mockDb.dbRemoveUserFilm(userId, filmIndex);
    }
    if (match = path.match(userGalleryRegex)) {
        const userId = parseInt(match[1]);
        const photoId = parseInt(match[2]);
        return mockDb.dbRemoveUserPhoto(userId, photoId);
    }

    throw new Error(`[MOCK API] Unhandled DELETE path: ${path}`);
  }
};


// --- REAL API CLIENT (for production) ---
// FIX: Extracted _fetch as a standalone function to resolve `this` context issues and type errors.
const _fetch = async (path: string, options: RequestInit = {}) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    
    if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Erreur API: ${response.status}`;
        try {
            const errorJson = JSON.parse(errorBody);
            errorMessage = errorJson.message || errorBody;
        } catch (e) {
            // If body is not json, use the raw text
            if (errorBody) errorMessage = errorBody;
        }
        throw new Error(errorMessage);
    }
    
    // Handle no content response
    if (response.status === 204) {
        return undefined;
    }

    return response.json();
};

const realApiClient: ApiClient = {
    get(path: string) {
        return _fetch(path, { method: 'GET' });
    },

    post(path: string, data: any) {
        return _fetch(path, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    put(path: string, data: any) {
        return _fetch(path, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete(path: string) {
        return _fetch(path, { method: 'DELETE' });
    },
};

// --- CHOOSE CLIENT BASED ON CONFIG ---
let apiClient: ApiClient;

if (API_URL) {
  console.log(`[API] Mode Production: Connexion à ${API_URL}`);
  apiClient = realApiClient;
} else {
  console.log('[API] Mode Développement: Utilisation de l\'API simulée.');
  apiClient = mockApiClient;
}

export default apiClient;