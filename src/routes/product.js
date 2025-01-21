// auth.routes.js
const express = require('express');
const { getAll, getDetail } = require('../controller/products.controller');
const router = express.Router();

router.get('/', getAll);
router.get('/:id', getDetail);

module.exports = router;
