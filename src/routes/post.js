// auth.routes.js
const express = require('express');
const {
  getAll,
  getDetail,
  createComment,
} = require('../controller/post.controller');
const { checkAuth } = require('../middlewares/auth');
const router = express.Router();

router.get('', getAll);
router.get('/:id', getDetail);
router.post('/comment', checkAuth, createComment);
module.exports = router;
