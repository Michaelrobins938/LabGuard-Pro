const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

const houses = {
    celestialOrder: { name: 'Celestial Order', points: 0 },
    kitsuneClan: { name: 'Kitsune Clan', points: 0 },
    luminaeSanctum: { name: 'Luminae Sanctum', points: 0 },
    umbralCovenant: { name: 'Umbral Covenant', points: 0 },
};

router.get('/', (req, res) => {
    res.json(houses);
});

router.post('/addPoints', verifyToken, (req, res) => {
    const { house, points } = req.body;
    if (houses[house]) {
        houses[house].points += points;
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.get('/leaderboard', (req, res) => {
    const leaderboard = Object.values(houses).sort((a, b) => b.points - a.points);
    res.json(leaderboard);
});

module.exports = router;
