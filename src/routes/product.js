// auth.routes.js
const express = require('express');
const { getAll, getDetail, productSearch } = require('../controller/products.controller');
const router = express.Router();

router.get('/', getAll);
router.get('/search', productSearch);
router.get('/:id', getDetail);

module.exports = router;
