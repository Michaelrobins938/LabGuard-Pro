const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const quests = {};

router.post('/create', verifyToken, (req, res) => {
    const { name, steps } = req.body;
    quests[name] = { name, steps, completedBy: [] };
    res.sendStatus(201);
});

router.post('/complete', verifyToken, (req, res) => {
    const { name, step } = req.body;
    const quest = quests[name];
    if (quest) {
        quest.completedBy.push({ user: req.user.username, step });
        res.sendStatus(200);
    } else {
        res.status(404).send('Quest not found');
    }
});

router.get('/:name', (req, res) => {
    const { name } = req.params;
    const quest = quests[name];
    if (quest) {
        res.json(quest);
    } else {
        res.status(404).send('Quest not found');
    }
});

module.exports = router;
