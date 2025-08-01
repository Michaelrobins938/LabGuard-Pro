const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const users = require('../data/users');

router.post('/earn', verifyToken, (req, res) => {
    const { amount } = req.body;
    const user = users[req.user.username];
    user.currency = (user.currency || 0) + amount;
    res.sendStatus(200);
});

router.post('/spend', verifyToken, (req, res) => {
    const { amount } = req.body;
    const user = users[req.user.username];
    if (user.currency >= amount) {
        user.currency -= amount;
        res.sendStatus(200);
    } else {
        res.status(400).send('Insufficient funds');
    }
});

router.get('/balance', verifyToken, (req, res) => {
    const user = users[req.user.username];
    res.json({ currency: user.currency });
});

module.exports = router;
