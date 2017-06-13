import mongoose from 'mongoose';
import Note from './note.model';

const options = { discriminatorKey: 'kind' };

const ImageNoteSchema = new mongoose.Schema({
  image: {
    type: Schema.ObjectId,
    ref: 'Image',
    required: true
  }
}, options);

export default Note.discriminator('ImageNote',
  ImageNoteSchema);
