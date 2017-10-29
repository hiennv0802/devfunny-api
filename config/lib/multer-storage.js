import multer from 'multer';
import MulterAzureStorage from 'multer-azure-storage';
import mkdirp from 'mkdirp';
import crypto from 'crypto';
import path from 'path';

const storageLocal = multer.diskStorage({
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

let storageAzure = null;

if (process.env.NODE_ENV === 'production') {
  storageAzure = new MulterAzureStorage({
    azureStorageConnectionString: 'https://devfunny.blob.core.windows.net/',
    azureStorageAccessKey: '41VgEplbKohcsF/xrcBVrJnddqcmxImKOcRQmRsMn+xwpDpsqLFLbaQDIyFaKbgLBnuxERxZVP6TxvuvnMv3gA==',
    azureStorageAccount: 'devfunny',
    containerName: 'devfunny',
    containerSecurity: 'blob'
  });
}

const multerStorage = multer({
  storage: process.env.NODE_ENV === 'production' ? storageAzure : storageLocal,
  limits: { fieldSize: 10 * 1024 * 1024 }
});

export default multerStorage;
