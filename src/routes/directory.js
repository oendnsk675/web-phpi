// auth.routes.js
const express = require('express');
const { getAll } = require('../controller/directory.controller');
const router = express.Router();

router.get('/', getAll);

module.exports = router;
