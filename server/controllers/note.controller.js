import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import ImageNote from '../models/image-note.model';
import Note from '../models/note.model';
import Section from '../models/section.model';
import Image from '../models/image.model';

function create(req, res, next) {
  Section.findOne({
    name: req.body.sectionName
  }, (errors, section) => { // eslint-disable-line
    if (errors) throw errors;
    if (!section) {
      const err = new APIError("Section doesn't exist", httpStatus.NOT_FOUND, true);
      return next(err);
    }

    Image.findOne({
      _id: req.body.imageId
    }, (errorImage, image) => { // eslint-disable-line
      if (errorImage) throw errorImage;
      if (!image) {
        const err = new APIError("Image doesn't exist", httpStatus.NOT_FOUND, true);
        return next(err);
      }

      const imageNote = new ImageNote({
        title: req.body.title,
        user: req.user._id,
        image: image._id,
        section: section._id
      });

      imageNote.save((err) => {
        if (err) {
          console.log(err); // eslint-disable-line
          const e = new APIError('Failed to create note', httpStatus.UNPROCESSABLE_ENTITY, true);
          return next(e);
        }
        return res.json(imageNote);
      });
    });
  });
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Note.list({ limit, skip })
    .then(notes => res.json(notes))
    .catch(e => next(e));
}

export default { create, list };
