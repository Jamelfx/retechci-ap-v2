import * as db from './mock-db';
import { Film, Availability, MemberStatus, UserRole, FinancialTransaction, MembershipApplication, AdminMessage, LiveEvent } from '../types';

// This file simulates a REST API client by routing calls to the appropriate mock database function.
// It allows the frontend to be developed independently of a live backend.

const TOKEN_KEY = 'retechci_auth_token';

const apiClient = {
  async get(path: string): Promise<any> {
    console.log(`[MOCK API] GET ${path}`);
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay

    if (path === '/api/auth/me') {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            return db.dbGetUserFromToken(token);
        }
        throw new Error('No active session.');
    }

    // Public routes don't need a token
    switch (path) {
      case '/api/technicians':
        return db.dbGetAllTechnicians();
      case '/api/news':
        return db.dbGetAllNews();
      case '/api/videos':
        return db.dbGetAllVideos();
      case '/api/partners':
        return db.dbGetAllPartners();
      case '/api/locations':
        return db.dbGetAllLocations();
      case '/api/costumes':
        return db.dbGetAllCostumes();
      case '/api/props':
        return db.dbGetAllProps();
      case '/api/equipment':
        return db.dbGetAllEquipment();
      case '/api/salaries':
        return db.dbGetAllSalaries();
      case '/api/live/event':
        return db.dbGetLiveEvent();
      case '/api/live/chat':
        return db.dbGetLiveChatMessages();
      case '/api/admin/applications':
        return db.dbGetAdminApplications();
      case '/api/admin/transactions':
        return db.dbGetAdminTransactions();
      case '/api/admin/messages':
        return db.dbGetAdminMessages();
      default:
        throw new Error(`[MOCK API] Unhandled GET path: ${path}`);
    }
  },

  async post(path: string, data: any): Promise<any> {
    console.log(`[MOCK API] POST ${path}`, data);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

    if (path === '/api/auth/login') {
      const result = await db.dbLoginUser(data.email, data.password);
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
        return db.dbAddMessage(data as Omit<AdminMessage, 'id'|'date'|'read'>);
    }
    if (path === '/api/applications') {
        return db.dbAddApplication(data as Omit<MembershipApplication, 'id'|'date'|'status'>);
    }
    if (match = path.match(userFilmographyRegex)) {
        const userId = parseInt(match[1]);
        return db.dbAddUserFilm(userId, data.film as Film);
    }
    if (match = path.match(userGalleryRegex)) {
        const userId = parseInt(match[1]);
        return db.dbAddUserPhoto(userId, data.photoUrl as string);
    }
     if (path.startsWith('/api/admin/applications/')) {
        const parts = path.split('/');
        const appId = parseInt(parts[4]);
        return db.dbActivateApplication(appId);
    }
    if (path === '/api/admin/transactions') {
        return db.dbAddTransaction(data as Omit<FinancialTransaction, 'id'>);
    }
    if (path === '/api/admin/members') {
        return db.dbAddSpecialMember(data);
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
    
    let match;

    if (path === '/api/admin/live-event') {
        return db.dbUpdateLiveEvent(data as Partial<LiveEvent>);
    }
    if (match = path.match(userAvailabilityRegex)) {
      return db.dbUpdateUserAvailability(parseInt(match[1]), data.availability as Availability);
    }
    if (match = path.match(userAvatarRegex)) {
        return db.dbUpdateUserAvatar(parseInt(match[1]), data.avatarUrl);
    }
    if (match = path.match(user2faRegex)) {
        return db.dbUpdateUser2FA(parseInt(match[1]), data.enabled);
    }
    if (match = path.match(userPaymentRegex)) {
        return db.dbUpdateUserPayment(parseInt(match[1]), data.year);
    }
    if (match = path.match(userPasswordRegex)) {
        return db.dbUpdateUserPassword(parseInt(match[1]), data.oldPassword, data.newPassword);
    }
    if (match = path.match(approveAppRegex)) {
        return db.dbApproveApplication(parseInt(match[1]));
    }
    if (match = path.match(inviteAppRegex)) {
        return db.dbInviteApplication(parseInt(match[1]));
    }
    if (match = path.match(sanctionMemberRegex)) {
        return db.dbSanctionMember(parseInt(match[1]));
    }
    if (match = path.match(statusMemberRegex)) {
        return db.dbUpdateMemberStatus(parseInt(match[1]), data.status as MemberStatus);
    }
    if (match = path.match(roleMemberRegex)) {
        return db.dbUpdateMemberRole(parseInt(match[1]), data.role as UserRole);
    }
    if (match = path.match(readMessageRegex)) {
        return db.dbMarkMessageAsRead(parseInt(match[1]));
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
        return db.dbRemoveUserFilm(userId, filmIndex);
    }
    if (match = path.match(userGalleryRegex)) {
        const userId = parseInt(match[1]);
        const photoId = parseInt(match[2]);
        return db.dbRemoveUserPhoto(userId, photoId);
    }

    throw new Error(`[MOCK API] Unhandled DELETE path: ${path}`);
  }
};

export default apiClient;