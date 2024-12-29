const path = require('path');
const { getAll, create, save } = require('./controller/admin/users.controller');

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

  app.get('/profile', (req, res) => {
    res.render('pages/profile', {
      title: 'Profile - Solun - Software & IT Solutions HTML Template',
    });
  });

  app.get('/register', (req, res) => {
    res.render('pages/register', {
      title: 'Register',
    });
  });

  app.get('/members', (req, res) => {
    const teamMembers = Array.from({ length: 10 }, (_, i) => ({
      name: `Person ${i + 1}`,
      role: `Role ${i + 1}`,
      image: `assets/images/team/${(i % 5) + 1}.jpg`, // Menggunakan gambar 1-5 secara bergantian
      linkedin: `https://linkedin.com/in/person${i + 1}`,
    }));

    res.render('pages/members', {
      title: 'List Member',
      teamMembers,
    });
  });

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

  app.get('/login', (req, res) => {
    res.render('pages/login', {
      title: 'Login',
    });
  });

  app.get('/admin/dashboard', (req, res) => {
    res.render('pages/admin/dashboard/index', {
      layout: 'layouts/dashboard',
      title: 'Dashboard',
    });
  });

  app.get('/admin/members', getAll);
  app.get('/admin/members/create', create);
  app.post('/admin/members/save', save);
};
