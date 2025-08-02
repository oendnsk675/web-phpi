// auth.routes.js
const express = require('express');
const {
  getProvinces,
  getRegencies,
  getUserByKtp,
} = require('../../controller/admin/users.controller');
const router = express.Router();

router.get('/provinces', getProvinces);
router.get('/regencies', getRegencies);
router.get('/user/by-ktp/:no_ktp', getUserByKtp);

module.exports = router;
