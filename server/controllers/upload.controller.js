import multerStorage from './../../config/lib/multer-storage';
import Image from '../models/image.model';

const upload = multerStorage.single('file');

function uploadImage(req, res, next) {
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
        const image = new Image({
          originalname: req.file.originalname,
          path: process.env.NODE_ENV === 'production' ? req.file.url : req.file.path
        });
        image.save()
          .then(() => res.json({
            success: true,
            image_id: image.id
          }))
          .catch(e => next(e));
      }
    }
  });
}

export default { uploadImage };
