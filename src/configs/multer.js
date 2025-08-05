const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'photos');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama unik
  },
});

const storageBlog = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads', 'blog'));
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
