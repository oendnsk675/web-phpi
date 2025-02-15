// auth.routes.js
const express = require('express');
const {
  getAll,
  create,
  edit,
  delete: remove,
  save,
  update,
  uploadImage,
} = require('../../controller/admin/post.controller');
const { checkAuth } = require('../../middlewares/auth');
const { upload, uploadBlog } = require('../../configs/multer');
const router = express.Router();

router.get('', checkAuth, getAll);
router.get('/create', checkAuth, create);
router.get('/edit/:id', checkAuth, edit);
router.get('/delete/:id', checkAuth, remove);
router.post('/save', checkAuth, upload.single('thumbnail'), save);
router.post('/image', checkAuth, uploadBlog.single('image'), uploadImage);
router.post('/update/:id', checkAuth, upload.single('thumbnail'), update);
module.exports = router;
