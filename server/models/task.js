const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: String,
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  config: String,
  outputFile: String,
  isExucated: Boolean,
  error: String,
  exucatedTime: String,
  status: {
    type: String,
    enum: ['new', 'pending', 'done', 'error'],
    default: 'new'
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
