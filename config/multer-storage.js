import multer from 'multer';
import MulterAzureStorage from 'multer-azure-storage';

const storageAzure = new MulterAzureStorage({
  azureStorageConnectionString: 'https://devfunny.blob.core.windows.net/',
  azureStorageAccessKey: 'aLkpJ4bBpXx7Sqiz/UyqYfhqyN+DHuSX0j78+WIJI1rUSrI3PJKx6yuq8yxo8jedVOe41qlSOxDOKHHtz0iAWA==',
  azureStorageAccount: 'devfunny',
  containerName: 'devfunny',
  containerSecurity: 'blob'
  })

const multerStorage = multer({
  storage: storageAzure,
  limits: { fieldSize: 10 * 1024 * 1024 }
});

export default multerStorage;
