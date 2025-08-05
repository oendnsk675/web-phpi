const path = require('path');
const {
  getAll,
  create,
  save,
  profile,
  edit,
  update,
  verify,
  suspend,
  updatePersonalProfile,
  doDelete,
} = require('./controller/admin/users.controller');

const {
  getAll: getAllProduct,
  create: createProduct,
  save: saveProduct,
  edit: editProduct,
  update: updateProduct,
  delete: deleteProduct,
} = require('./controller/admin/products.controller');

const {
  getAll: getAllCategory,
  create: createCategory,
  save: saveCategory,
  edit: editCategory,
  update: updateCategory,
  delete: deleteCategory,
} = require('./controller/admin/categories.controller');

const {
  register,
  doRegister,
  login,
  doLogin,
} = require('./controller/auth/auth.controller');
const { upload } = require('./configs/multer');
const { checkAuth } = require('./middlewares/auth');
const {
  getAllMember,
  profileMember,
  findYourGuide,
  searchGuide,
} = require('./controller/members.controller');
const { checkAuthorization } = require('./middlewares/authorization');
const { multerErrorHandler } = require('./middlewares/multerError');

const apiRoutes = require('./routes/api/index');
const homeRoutes = require('./routes/home');
const productMemberRoutes = require('./routes/product');
const directoryRoutes = require('./routes/directory');
const reviewRoutes = require('./routes/review');
const panelLocationRoutes = require('./routes/admin/location');
const postRoutes = require('./routes/admin/post');
const postUserRoutes = require('./routes/post');
const { getAllDashboard } = require('./controller/admin/dashboard.controller');
const multer = require('multer');

module.exports = (app) => {
  app.use('/', homeRoutes);
  app.use('/api', apiRoutes);
  app.use('/products', productMemberRoutes);
  app.use('/directory', directoryRoutes);
  app.use('/review', reviewRoutes);
  app.use('/blogs', postUserRoutes);
  app.use('/panel/post', postRoutes);
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        if (req.xhr) {
          return res
            .status(400)
            .json({ message: 'Ukuran file terlalu besar! Maksimal 1MB.' });
        }
        req.flash('errorMessage', 'Ukuran file terlalu besar! Maksimal 1MB.');
        return res.redirect(req.get('Referer') || '/panel/dashboard');
      }
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });

  app.get('/about', (req, res) => {
    res.render('pages/about', {
      title: 'Tentang - PHPI',
    });
  });

  app.get('/profile/:id', profileMember);

  app.get('/register', register);
  app.post('/register', doRegister);

  app.get('/members', getAllMember);
  app.get('/search/guide', searchGuide);
  app.get('/find-your-guide', findYourGuide);

  app.get('/login', login);
  app.post('/login', doLogin);

  app.get('/panel/dashboard', checkAuth, checkAuthorization, getAllDashboard);

  app.get('/panel/profile', checkAuth, profile);

  app.get('/panel/members', checkAuth, checkAuthorization, getAll);
  app.get('/panel/members/create', checkAuth, checkAuthorization, create);
  app.get('/panel/members/edit/:id', checkAuth, checkAuthorization, edit);
  app.get('/panel/members/verify/:id', checkAuth, checkAuthorization, verify);
  app.get('/panel/members/suspend/:id', checkAuth, checkAuthorization, suspend);
  app.get('/panel/members/delete/:id', checkAuth, checkAuthorization, doDelete);
  app.post('/panel/members/save', checkAuth, save);
  app.post('/panel/members/update/:id', checkAuth, update);
  app.post(
    '/panel/members/update-personal-profile/:id',
    checkAuth,
    upload.single('photo'),
    updatePersonalProfile,
  );

  app.get('/panel/category', checkAuth, checkAuthorization, getAllCategory);
  app.get(
    '/panel/category/create',
    checkAuth,
    checkAuthorization,
    createCategory,
  );
  app.get(
    '/panel/category/edit/:id',
    checkAuth,
    checkAuthorization,
    editCategory,
  );
  app.get(
    '/panel/category/delete/:id',
    checkAuth,
    checkAuthorization,
    deleteCategory,
  );
  app.post('/panel/category/save', checkAuth, saveCategory);
  app.post('/panel/category/update/:id', checkAuth, updateCategory);

  app.use('/panel/location', panelLocationRoutes);

  app.get('/panel/products', checkAuth, getAllProduct);
  app.get('/panel/products/create', checkAuth, createProduct);
  app.get('/panel/products/delete/:id', checkAuth, deleteProduct);
  app.get('/panel/products/edit/:id', checkAuth, editProduct);
  app.post(
    '/panel/products/save',
    checkAuth,
    upload.array('banners', 5),
    multerErrorHandler,
    saveProduct,
  );
  app.post(
    '/panel/products/update/:id',
    checkAuth,
    upload.array('banners', 5),
    multerErrorHandler,
    updateProduct,
  );

  app.get('/history', (req, res) => {
    return res.render('pages/history', {
      title: 'Sejarah',
    });
  });
  app.get('/contribute', (req, res) => {
    return res.render('pages/contribute', {
      title: 'Sejarah',
    });
  });
  app.get('/vision-mission', (req, res) => {
    return res.render('pages/vision-mission', {
      title: 'Vision & Mission',
    });
  });

  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to sign out');
      }
      res.redirect('/login');
    });
  });
};
