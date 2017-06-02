import multer from 'multer';
import mkdirp from 'mkdirp';
import crypto from 'crypto';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `uploads`;
    mkdirp.sync(path, { opts: { mode: '0755'} });
    cb(null, path);
  },
  filename: function(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpeg|jpg|gif)$/)) {
      const err = new Error();
      err.code = 'filetype';
      return cb(err);
    } else {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)
        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
  }
});

const multerStorage = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 }
});

export default multerStorage;
