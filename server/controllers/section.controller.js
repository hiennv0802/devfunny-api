import Section from '../models/section.model';
import multerStorage from './../../config/lib/multer-storage';

const upload = multerStorage.single('file');

function create(req, res, next) {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.json({ success: false, message: 'File size is too large. Max limit is 10MB' });
      } else if (err.code === 'filetype') {
        res.json({ success: false, message: 'Filetype is invalid. Must be .png' });
      } else {
        res.json({ success: false, message: err });
      }
    } else {
      if (!req.file) { // eslint-disable-line
        res.json({ success: false, message: 'No file was selected' });
      } else {
        const section = new Section({
          name: req.body.name,
          image: {
            originalname: req.file.originalname,
            path: process.env.NODE_ENV === 'production' ? req.file.url : req.file.path
          }
        });
        section.save()
          .then(savedSection => res.json(savedSection))
          .catch((e) => {
            next(e);
          });
      }
    }
  });
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Section.list({ limit, skip })
    .then(sections => res.json(sections))
    .catch(e => next(e));
}

export default { create, list };
