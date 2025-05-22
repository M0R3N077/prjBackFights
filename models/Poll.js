
const mongoose = require('mongoose');

const pollOptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  votes: {
    type: Number,
    default: 0
  },
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [pollOptionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  martialArtId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual para contagem total de votos
pollSchema.virtual('totalVotes').get(function() {
  return this.options.reduce((total, option) => total + option.votes, 0);
});

// Calcular percentagem de cada opção antes de retornar o documento
pollSchema.pre('find', function(next) {
  this.populate('createdBy', 'name avatar');
  next();
});

pollSchema.pre('findOne', function(next) {
  this.populate('createdBy', 'name avatar');
  next();
});

// Set virtuals when converting to JSON
pollSchema.set('toJSON', { virtuals: true });
pollSchema.set('toObject', { virtuals: true });

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
