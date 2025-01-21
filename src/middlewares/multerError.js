const multer = require('multer');

exports.multerErrorHandler = (err, req, res, next) => {
  if (
    err instanceof multer.MulterError &&
    err.code === 'LIMIT_UNEXPECTED_FILE'
  ) {
    req.flash('errorMessage', 'Maksimal 5 file dapat diunggah');
    return res.redirect('/panel/products');
  }
  next(err);
};
