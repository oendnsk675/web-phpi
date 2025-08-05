// auth.routes.js
const express = require('express');
const {
  getProvinces,
  getRegencies,
  getUserByKtp,
  uploadFoto,
} = require('../../controller/admin/users.controller');
const { upload } = require('../../configs/multer');
const router = express.Router();

router.get('/provinces', getProvinces);
router.get('/regencies', getRegencies);
router.get('/user/by-ktp/:no_ktp', getUserByKtp);
router.post('/cdn/photo/:user_id', upload.single('photo'), uploadFoto);

module.exports = router;
