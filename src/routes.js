module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('pages/home', {
      title: 'Solun – Software & IT Solutions HTML Template',
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
};
