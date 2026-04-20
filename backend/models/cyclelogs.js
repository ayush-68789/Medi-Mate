const mongoose = require('mongoose');

const cycleLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('CycleLog', cycleLogSchema);