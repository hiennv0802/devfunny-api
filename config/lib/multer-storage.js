import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import mkdirp from 'mkdirp';
import crypto from 'crypto';
import path from 'path';

let storage;

if (process.env.NODE_ENV === 'test') {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const pathStorage = 'uploads';
      mkdirp.sync(pathStorage, { opts: { mode: '0755' } });
      cb(null, pathStorage);
    },
    filename: (req, file, cb) => {
      if (!file.originalname.match(/\.(png|jpeg|jpg|gif)$/)) {
        const err = new Error();
        err.code = 'filetype';
        return cb(err);
      }
      return crypto.pseudoRandomBytes(16, (err, raw) => {
        if (err) return cb(err);
        return cb(null, raw.toString('hex') + path.extname(file.originalname));
      });
    }
  });
} else {
  const spacesEndpoint = new aws.Endpoint(process.env.ENDPOINT);
  const s3 = new aws.S3({
    endpoint: spacesEndpoint
  });

  storage = multerS3({
    s3,
    bucket: process.env.BUCKET,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (request, file, cb) => {
      cb(null, `${Date.now().toString()}_${file.originalname}`);
    }
  });
}

const multerStorage = multer({
  storage,
  limits: { fieldSize: 10 * 1024 * 1024 }
});

export default multerStorage;
