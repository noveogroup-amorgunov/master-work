const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const logSchema = new mongoose.Schema({
  time: Date,
  level: String,
  message: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
