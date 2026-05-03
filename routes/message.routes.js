import { Router } from 'express';
import * as messageController from '../controllers/message.controller.js';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/save', authMiddleware.authUser, messageController.saveMessage);
router.get('/project/:projectId', authMiddleware.authUser, messageController.getProjectMessages);

export default router;