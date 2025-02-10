// auth.routes.js
const express = require('express');
const {
  getAll,
  create,
  edit,
  delete: remove,
  save,
  update,
} = require('../../controller/admin/locations.controller');
const { checkAuth } = require('../../middlewares/auth');
const { upload } = require('../../configs/multer');
const router = express.Router();

router.get('', checkAuth, getAll);
router.get('/create', checkAuth, create);
router.get('/edit/:id', checkAuth, edit);
router.get('/delete/:id', checkAuth, remove);
router.post('/save', checkAuth, upload.single('thumbnail'), save);
router.post('/update/:id', checkAuth, upload.single('thumbnail'), update);
module.exports = router;
