const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const networkSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,
  model: mongoose.Schema.Types.Mixed,
  options: mongoose.Schema.Types.Mixed,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const Network = mongoose.model('Network', networkSchema);
module.exports = Network;
