const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCharacterSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  characterId: { type: Schema.Types.ObjectId, ref: 'Character' },
  level: { type: Number, default: 1 },
  strength: Number,
  agility: Number,
  intelligence: Number,
  achievements: { type: Map, of: Number, default: {} }
});

const UserCharacter = mongoose.model('UserCharacter', userCharacterSchema);

module.exports = UserCharacter;
