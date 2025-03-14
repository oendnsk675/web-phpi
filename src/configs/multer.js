const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads')); // Folder penyimpanan
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama unik
  },
});

const storageBlog = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads', 'blog')); // Folder penyimpanan
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama unik
  },
});

exports.upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
});
exports.uploadBlog = multer({
  storage: storageBlog,
  limits: { fileSize: 1 * 1024 * 1024 },
});
