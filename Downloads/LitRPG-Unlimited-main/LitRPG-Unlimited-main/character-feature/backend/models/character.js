const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
  name: String,
  image_url: String,
  base_strength: Number,
  base_agility: Number,
  base_intelligence: Number
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
