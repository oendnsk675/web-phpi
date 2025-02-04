// auth.routes.js
const express = require('express');
const { createReview } = require('../controller/review.controller');
const { checkAuth } = require('../middlewares/auth');
const router = express.Router();

router.post('/', checkAuth, createReview);

module.exports = router;
