const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const serverSchema = new Schema({
  name: String,
  settings: [Schema.Types.Mixed],
  isAvailable: Boolean,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const Server = mongoose.model('Server', serverSchema);

module.exports = Server;
