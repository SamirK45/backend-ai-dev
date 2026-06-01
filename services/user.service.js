import { sendVerificationEmail } from '../controllers/user.controller.js';
import userModel from '../models/user.model.js';
import { getConfig } from '../config/config.js';

export const createUser = async ({ email, password }) => {

    if (!email || !password) {
        throw new Error('Email and password are required')
    }

    const config = await getConfig();
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (!emailDomain || !config.allowedEmailDomains.includes(emailDomain)) {
        throw new Error('Please use a valid email from a popular provider (Gmail, Outlook, Yahoo, etc.). Disposable emails are not allowed.')
    }

    const hashedPassword = await userModel.hashPassword(password)
    const min = Math.pow(10, config.otp.length - 1);
    const max = Math.pow(10, config.otp.length) - 1;
    const verificationCode = Math.floor(min + Math.random() * (max - min + 1)).toString();

    const user = await new userModel({
        email,
        password: hashedPassword,
        otp: verificationCode
    })

    await user.save();

    sendVerificationEmail(user.email, user.otp);

    console.log(user + "in user service");

    return user;
}


export const getAllUsers = async ({ userId }) => {
    const users = await userModel.find({
        _id: {
            $ne: userId
        }
    });
    return users;
}

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await user.hashPassword(password);
        const user = new user({ email, password: hashedPassword });
        user.generateVerificationToken();
        await user.save();

        await sendVerificationEmail(user);

        res.status(201).send('User registered successfully. Please check your email to verify your account.');
    } catch (error) {
        res.status(500).send('Server error');
    }
};

export const verifyUser = async ({ email, otp }) => {
    try {
        const user = await userModel.findOne({ email, otp });

        if (!user) {
            throw new Error('Invalid OTP');
        }

        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        return user;

    } catch (error) {
        throw error;
    }
}
