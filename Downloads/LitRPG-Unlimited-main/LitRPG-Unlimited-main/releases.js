 
const express = require('express');
const router = express.Router();
const Release = require('../models/Release');

router.get('/', async (req, res) => {
    try {
        const releases = await Release.find();
        res.json(releases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
