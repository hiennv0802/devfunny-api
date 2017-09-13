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
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  section: {
    type: mongoose.Schema.ObjectId,
    ref: 'Section',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, options);

NoteSchema.statics = {
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .populate('image')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

export default mongoose.model('Note', NoteSchema);
