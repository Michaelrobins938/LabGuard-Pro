"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: email,
        to: process.env.EMAIL,
        subject: `Contact form submission from ${name}`,
        text: message
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Message sent');
    }
    catch (error) {
        res.status(500).send('Error sending message');
    }
});
exports.default = router;
//# sourceMappingURL=contact.js.map