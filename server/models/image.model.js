import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    trim: true,
    index: {
      unique: true
    }
  },
  originalname: {
    type: String,
    required: true
  }
});

export default mongoose.model('Image', ImageSchema);
