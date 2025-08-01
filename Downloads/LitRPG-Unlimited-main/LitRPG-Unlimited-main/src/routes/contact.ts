import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
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
    } catch (error) {
        res.status(500).send('Error sending message');
    }
});

export default router;
 
