const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_feeds', // Name of the folder in Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg'], // Restrict file formats
  },
});

const upload = multer({ storage });

module.exports = upload;