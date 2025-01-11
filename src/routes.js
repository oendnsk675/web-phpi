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
} = require('./controller/admin/users.controller');
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
} = require('./controller/members.controller');
const { checkAuthorization } = require('./middlewares/authorization');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('pages/home', {
      title: 'Solun – Software & IT Solutions HTML Template',
    });
  });

  app.get('/about', (req, res) => {
    res.render('pages/about', {
      title: 'Profile - Solun - Software & IT Solutions HTML Template',
    });
  });

  app.get('/profile/:id', profileMember);

  app.get('/register', register);
  app.post('/register', doRegister);

  app.get('/members', getAllMember);

  app.get('/products', (req, res) => {
    const products = Array.from({ length: 6 }, (_, i) => ({
      name: `Person ${i + 1}`,
      role: `Role ${i + 1}`,
      image: `assets/images/team/${(i % 5) + 1}.jpg`, // Menggunakan gambar 1-5 secara bergantian
      linkedin: `https://linkedin.com/in/person${i + 1}`,
    }));

    res.render('pages/products', {
      title: 'List Product',
      products,
    });
  });

  app.get('/login', login);
  app.post('/login', doLogin);

  app.get('/panel/dashboard', checkAuth, checkAuthorization, (req, res) => {
    res.render('pages/panel/dashboard/index', {
      layout: 'layouts/dashboard',
      title: 'Dashboard',
    });
  });

  app.get('/panel/profile', checkAuth, profile);

  app.get('/panel/members', checkAuth, checkAuthorization, getAll);
  app.get('/panel/members/create', checkAuth, checkAuthorization, create);
  app.get('/panel/members/edit/:id', checkAuth, checkAuthorization, edit);
  app.get('/panel/members/verify/:id', checkAuth, checkAuthorization, verify);
  app.get('/panel/members/suspend/:id', checkAuth, checkAuthorization, suspend);
  app.post('/panel/members/save', checkAuth, upload.single('photo'), save);
  app.post(
    '/panel/members/update/:id',
    checkAuth,
    upload.single('photo'),
    update,
  );

  // logout
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to sign out');
      }
      res.redirect('/login');
    });
  });
};
