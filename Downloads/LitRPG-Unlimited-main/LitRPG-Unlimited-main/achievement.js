const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const achievements = [];

router.get('/', (req, res) => {
    res.json(achievements);
});

router.post('/unlock', verifyToken, (req, res) => {
    const { achievement } = req.body;
    achievements.push({ user: req.user.username, achievement });
    res.sendStatus(201);
});

module.exports = router;
