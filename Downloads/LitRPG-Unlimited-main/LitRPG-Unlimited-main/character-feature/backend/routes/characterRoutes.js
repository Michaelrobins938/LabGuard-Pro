const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const UserCharacter = require('../models/UserCharacter');

// Get all characters
router.get('/characters', async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Select a character for a user
router.post('/select-character', async (req, res) => {
  const { userId, characterId } = req.body;

  try {
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    const userCharacter = new UserCharacter({
      userId,
      characterId,
      strength: character.base_strength,
      agility: character.base_agility,
      intelligence: character.base_intelligence
    });

    await userCharacter.save();
    res.json(userCharacter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get character sheet for a user
router.get('/character-sheet/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userCharacter = await UserCharacter.findOne({ userId }).populate('characterId');
    if (!userCharacter) {
      return res.status(404).json({ error: 'Character not found for this user' });
    }

    res.json(userCharacter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
