import {Router} from 'express';
import * as userController from '../controllers/user.controller.js';
import {body} from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';
import { rateLimit } from 'express-rate-limit';

const router = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 login requests per windowMs
    message: { message: 'Too many login attempts, please try again after 15 minutes' },
});

router.post('/register',
     body('email').isEmail().withMessage('Email must be valid'),
body('password').isLength({min: 3}).withMessage('Password must be at least 3 characters long'),
     userController.createUserController);

router.post('/verify-user',     body('email').isEmail().withMessage('Email must be valid'),
body('otp').isLength({min: 6}).withMessage('OTP must be valide'), userController.verifyUserEMail);

router.post('/login',
     loginLimiter,
     body('email').isEmail().withMessage('Email must be valid'),
body('password').isLength({min: 3}).withMessage('Password is required'),
     userController.loginController);

router.get('/profile',authMiddleware.authUser, userController.getProfileController);

router.get('/logout',authMiddleware.authUser, userController.logoutController);

router.get('/all',authMiddleware.authUser, userController.getAllUsersController);


export default router;