
const mongoose = require('mongoose');

const martialArtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  foundedYear: {
    type: Number
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  styles: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MartialArt = mongoose.model('MartialArt', martialArtSchema);

module.exports = MartialArt;
