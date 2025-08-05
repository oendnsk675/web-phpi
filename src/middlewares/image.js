const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

exports.processImage = async (req, res, next) => {
  try {
    if (!req.file || !req.file.path) return next();

    const originalPath = req.file.path; // path file hasil upload awal
    const uploadsDir = path.dirname(originalPath); // langsung ambil direktori dari original path

    const processedFileName = `${Date.now()}.png`;
    const processedPath = path.join(uploadsDir, processedFileName);

    // Proses resize + convert ke png
    await sharp(originalPath)
      .resize(300, 300, {
        fit: sharp.fit.cover,
        position: 'center',
      })
      .png({ quality: 80 })
      .toFile(processedPath);

    // Hapus file asli (optional)
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }

    // Tambahkan properti file hasil ke objek req.file
    req.file.filename = processedFileName;
    req.file.path = processedPath;

    next();
  } catch (err) {
    console.error('Image processing error:', err);
    return res.status(500).json({ message: 'Failed to process image' });
  }
};
