const mongoose = require('mongoose');

const cycleLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',         // links to your existing users collection
    required: true
  },
  start: {
    type: String,        // stored as "YYYY-MM-DD"
    required: true
  },
  end: {
    type: String,        // stored as "YYYY-MM-DD", can be null
    default: null
  }
}, { timestamps: true }); // adds createdAt & updatedAt automatically

module.exports = mongoose.model('CycleLog', cycleLogSchema);