import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from './models/User';
import { generateAuthToken } from './middleware/auth';

const router = express.Router();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// User registration
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).send({ message: 'Username already exists. Please choose another one.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });

        // Generate activation token
        const activationToken = crypto.randomBytes(20).toString('hex');
        user.activationToken = activationToken;
        user.activationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

        await user.save();

        // Send activation email
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Account Activation',
            text: `Hello ${username},\n\nPlease activate your account by clicking the following link, or paste it into your browser:\n\n` +
                `http://localhost:3000/auth/activate/${activationToken}\n\n` +
                `If you did not request this, please ignore this email.\n`,
        };

        await transporter.sendMail(mailOptions);
        res.send({ message: 'Registration successful. Please check your email to activate your account.', user });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred during registration. Please try again later.' });
    }
});

// Account activation
router.get('/activate/:token', async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            activationToken: token,
            activationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).send({ message: 'Activation token is invalid or has expired.' });
            return;
        }

        user.isActivated = true;
        user.activationToken = undefined;
        user.activationTokenExpires = undefined;

        await user.save();

        res.send({ message: 'Account activated successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Error activating account. Please try again later.' });
    }
});

// User login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).send({ message: 'Invalid username or password.' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).send({ message: 'Invalid username or password.' });
            return;
        }

        const token = generateAuthToken((user as any)._id.toString());
        res.cookie('token', token, { httpOnly: true });
        res.send({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred during login. Please try again later.' });
    }
});

// Password reset request
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).send({ message: 'No account with that email found.' });
            return;
        }

        // Generate reset token
        const token = crypto.randomBytes(20).toString('hex');

        // Set token and expiration on user
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await user.save();

        // Send reset email
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested to reset your password. Please click the following link, or paste it into your browser to complete the process within one hour of receiving it:\n\n` +
                `http://localhost:3000/reset-password.html?token=${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);
        res.send({ message: 'An email has been sent to the provided address with further instructions.' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: 'Error in sending email. Please try again later.' });
    }
});

// Password reset
router.post('/reset-password/:token', async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).send({ message: 'Password reset token is invalid or has expired.' });
            return;
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.send({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: 'Error resetting password. Please try again later.' });
    }
});

export default router;
