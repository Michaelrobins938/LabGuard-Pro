"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ username });
        if (existingUser) {
            res.status(400).send({ message: 'Username already exists. Please choose another one.' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({ username, email, password: hashedPassword });
        const activationToken = crypto_1.default.randomBytes(20).toString('hex');
        user.activationToken = activationToken;
        user.activationTokenExpires = new Date(Date.now() + 3600000);
        await user.save();
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
    }
    catch (error) {
        res.status(500).send({ message: 'An error occurred during registration. Please try again later.' });
    }
});
router.get('/activate/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User_1.default.findOne({
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
    }
    catch (error) {
        res.status(500).send({ message: 'Error activating account. Please try again later.' });
    }
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User_1.default.findOne({ username });
        if (!user) {
            res.status(401).send({ message: 'Invalid username or password.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).send({ message: 'Invalid username or password.' });
            return;
        }
        const token = (0, auth_1.generateAuthToken)(user._id.toString());
        res.cookie('token', token, { httpOnly: true });
        res.send({ message: 'Login successful', user });
    }
    catch (error) {
        res.status(500).send({ message: 'An error occurred during login. Please try again later.' });
    }
});
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).send({ message: 'No account with that email found.' });
            return;
        }
        const token = crypto_1.default.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await user.save();
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
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error in sending email. Please try again later.' });
    }
});
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            res.status(400).send({ message: 'Password reset token is invalid or has expired.' });
            return;
        }
        user.password = await bcryptjs_1.default.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.send({ message: 'Password has been reset successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error resetting password. Please try again later.' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map