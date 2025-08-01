const mongoose = require('mongoose');

const releaseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    img: { type: String, required: true }
});

module.exports = mongoose.model('Release', releaseSchema);
