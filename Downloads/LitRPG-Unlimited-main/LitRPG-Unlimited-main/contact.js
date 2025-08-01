const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
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

module.exports = router;
 
