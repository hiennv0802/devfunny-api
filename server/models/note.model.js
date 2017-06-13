import mongoose from 'mongoose';

const options = { discriminatorKey: 'kind' };

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 140,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  section: {
    type: Schema.ObjectId,
    ref: 'Section',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, options);

export default mongoose.model('Note', NoteSchema);
