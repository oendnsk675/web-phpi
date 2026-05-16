const multer = require('multer');
const path = require('path');
const fs = require('fs');

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const imageFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const isValidMime = allowedMimeTypes.includes(file.mimetype);
  const isValidExt = allowedExtensions.includes(ext);

  if (!isValidMime || !isValidExt) {
    return cb(
      new Error(
        'Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP.',
      ),
    );
  }

  cb(null, true);
};

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
  fileFilter: imageFileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
});
exports.uploadBlog = multer({
  storage: storageBlog,
  fileFilter: imageFileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
});
