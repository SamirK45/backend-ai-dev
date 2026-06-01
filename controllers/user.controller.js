import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import redisClient from '../services/redis.service.js';
import config from '../config/config.js';

import { validationResult } from 'express-validator';

import { sendEmail } from '../services/otp.service.js';
import { verificationTemplate } from '../verification-template.js';

export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {





        const user = await userService.createUser(req.body);
        await user.save();
        const token = await user.generateToken();

        delete user._doc.password;
        res.status(201).json({ user, token });

    } catch (error) {
        res.status(500).send(error.message);
    }
}


export const loginController = async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;

        console.log(email, password)

        const user = await userModel.findOne({ email }).select('+password');

        console.log(user);

        if (!user) {
            return res.status(401).json({ errors: "Invalid Credentials" });
        }

        const isMatch = await user.validatePassword(password);

        if (!isMatch) {
            return res.status(401).json({ errors: "Invalid Credentials" });
        }

        const token = await user.generateToken();

        delete user._doc.password;

        res.status(200).json({ user, token });


    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}


export const getProfileController = async (req, res) => {
    console.log(req.user);

    res.status(201).json({ user: req.user });
}

export const logoutController = async (req, res) => {

    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        redisClient.set(token, 'logout', 'EX', config.tokenBlacklist.ttlSeconds);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}


export const getAllUsersController = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne(
            { email: req.user.email }
        );
        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });
        res.status(200).json({ users: allUsers });
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
}


export const sendVerificationEmail = async (email, otp) => {
    try {
        await sendEmail({
            to: email,
            subject: "Verify Your Email",
            html: verificationTemplate.replace("[Verification Code]", otp),
        });
    } catch (error) {
        console.error('Failed to send verification email:', error);
    }
}

export const verifyUserEMail = async (req, res) => {

    try {
        const { email, otp } = req.body;
        await userService.verifyUser({ email, otp });
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {

        res.status(400).json({ message: 'Invalid OTP' });
    }
}
