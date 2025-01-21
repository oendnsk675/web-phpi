// auth.routes.js
const express = require('express');
const { getAll } = require('../controller/home.controller');
const router = express.Router();

router.get('/', getAll);

module.exports = router;
