import express from 'express';
import { registerClient, authorize, token } from '../controllers/oauthController';
import { verifyUserJWT } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/api/clients/register', registerClient);
router.get('/oauth/authorize', verifyUserJWT, authorize);
router.post('/oauth/token', token);

export default router;
