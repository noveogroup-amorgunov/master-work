const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const fileSchema = new mongoose.Schema({
  contentType: String,
  contentUrl: String,
  originalName: String,
  path: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
