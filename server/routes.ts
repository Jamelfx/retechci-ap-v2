// @ts-nocheck
import express from 'express';
import { 
    dbGetAllTechnicians, dbGetAllNews, dbGetAllVideos, dbGetAllPartners,
    dbGetAllLocations, dbGetAllCostumes, dbGetAllProps, dbGetAllEquipment, dbGetAllSalaries,
    dbLoginUser, dbUpdateUserAvailability, dbAddUserFilm, dbRemoveUserFilm, dbUpdateUserAvatar,
    dbAddUserPhoto, dbRemoveUserPhoto, dbUpdateUserPassword, dbUpdateUser2FA, dbUpdateUserPayment,
    dbAddMessage, dbAddApplication,
    dbGetAdminApplications, dbGetAdminTransactions, dbGetAdminMessages, dbApproveApplication,
    dbInviteApplication, dbActivateApplication, dbSanctionMember, dbUpdateMemberStatus, dbUpdateMemberRole,
    dbAddTransaction, dbMarkMessageAsRead
} from './database';

const router = express.Router();

// =================================================
// ROUTES PUBLIQUES (GET)
// =================================================
router.get('/technicians', async (req, res) => res.json(await dbGetAllTechnicians()));
router.get('/news', async (req, res) => res.json(await dbGetAllNews()));
router.get('/videos', async (req, res) => res.json(await dbGetAllVideos()));
router.get('/partners', async (req, res) => res.json(await dbGetAllPartners()));
router.get('/locations', async (req, res) => res.json(await dbGetAllLocations()));
router.get('/costumes', async (req, res) => res.json(await dbGetAllCostumes()));
router.get('/props', async (req, res) => res.json(await dbGetAllProps()));
router.get('/equipment', async (req, res) => res.json(await dbGetAllEquipment()));
router.get('/salaries', async (req, res) => res.json(await dbGetAllSalaries()));

// =================================================
// ROUTES PUBLIQUES (POST)
// =================================================
router.post('/messages', async (req, res) => res.status(201).json(await dbAddMessage(req.body)));
router.post('/applications', async (req, res) => res.status(201).json(await dbAddApplication(req.body)));


// =================================================
// AUTHENTIFICATION
// =================================================
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await dbLoginUser(email, password);
  if (user) res.json(user);
  else res.status(401).json({ message: 'Identifiants invalides.' });
});

// =================================================
// ROUTES UTILISATEUR (Dashboard)
// =================================================
const handleUserUpdate = async (dbFunction, req, res) => {
    try {
        const updatedUser = await dbFunction();
        if (updatedUser) res.json(updatedUser);
        else res.status(404).json({ message: 'Utilisateur non trouvé.' });
    } catch (e) { res.status(500).json({ message: 'Erreur serveur.'}); }
};

router.put('/users/:userId/availability', (req, res) => handleUserUpdate(() => dbUpdateUserAvailability(parseInt(req.params.userId), req.body.availability), req, res));
router.put('/users/:userId/avatar', (req, res) => handleUserUpdate(() => dbUpdateUserAvatar(parseInt(req.params.userId), req.body.avatarUrl), req, res));
router.put('/users/:userId/2fa', (req, res) => handleUserUpdate(() => dbUpdateUser2FA(parseInt(req.params.userId), req.body.enabled), req, res));
router.put('/users/:userId/payment', (req, res) => handleUserUpdate(() => dbUpdateUserPayment(parseInt(req.params.userId), req.body.year), req, res));
router.put('/users/:userId/password', async (req, res) => {
    await dbUpdateUserPassword(parseInt(req.params.userId), req.body.oldPassword, req.body.newPassword);
    res.json({ message: 'Mot de passe mis à jour.' });
});

router.post('/users/:userId/filmography', (req, res) => handleUserUpdate(() => dbAddUserFilm(parseInt(req.params.userId), req.body.film), req, res));
router.delete('/users/:userId/filmography/:filmIndex', (req, res) => handleUserUpdate(() => dbRemoveUserFilm(parseInt(req.params.userId), parseInt(req.params.filmIndex)), req, res));

router.post('/users/:userId/gallery', (req, res) => handleUserUpdate(() => dbAddUserPhoto(parseInt(req.params.userId), req.body.photoUrl), req, res));
router.delete('/users/:userId/gallery/:photoId', (req, res) => handleUserUpdate(() => dbRemoveUserPhoto(parseInt(req.params.userId), parseInt(req.params.photoId)), req, res));

// =================================================
// ROUTES ADMINISTRATION
// =================================================
router.get('/admin/applications', async (req, res) => res.json(await dbGetAdminApplications()));
router.get('/admin/transactions', async (req, res) => res.json(await dbGetAdminTransactions()));
router.get('/admin/messages', async (req, res) => res.json(await dbGetAdminMessages()));

router.put('/admin/applications/:appId/approve', async (req, res) => res.json(await dbApproveApplication(parseInt(req.params.appId))));
router.put('/admin/applications/:appId/invite', async (req, res) => res.json(await dbInviteApplication(parseInt(req.params.appId))));
router.post('/admin/applications/:appId/activate', async (req, res) => res.json(await dbActivateApplication(parseInt(req.params.appId))));

router.put('/admin/members/:memberId/sanction', async (req, res) => res.json(await dbSanctionMember(parseInt(req.params.memberId))));
router.put('/admin/members/:memberId/status', async (req, res) => res.json(await dbUpdateMemberStatus(parseInt(req.params.memberId), req.body.status)));
router.put('/admin/members/:memberId/role', async (req, res) => res.json(await dbUpdateMemberRole(parseInt(req.params.memberId), req.body.role)));

router.post('/admin/transactions', async (req, res) => res.status(201).json(await dbAddTransaction(req.body)));

router.put('/admin/messages/:messageId/read', async (req, res) => res.json(await dbMarkMessageAsRead(parseInt(req.params.messageId))));

export default router;
