import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Image from './image.model';
import APIError from '../helpers/APIError';

const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  image: Image.schema
});

SectionSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((section) => {
        if (section) {
          return section;
        }
        const err = new APIError('No such section exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

export default mongoose.model('Section', SectionSchema);
