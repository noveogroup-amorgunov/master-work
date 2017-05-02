const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const programSchema = new mongoose.Schema({
  name: String, // unique in ogranization
  isActive: Boolean,
  path: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const Program = mongoose.model('Program', programSchema);
module.exports = Program;
