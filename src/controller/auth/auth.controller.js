const AppDataSource = require('../../configs/ormconfig');
const User = require('../../models/User');

exports.register = async (req, res) => {
  res.render('pages/register', {
    title: 'Register',
  });
};

exports.doRegister = async (req, res) => {
  try {
    const payload = req.body;
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(payload);

    req.flash('successMessage', 'User berhasil registerasi');
    res.redirect('/login');
  } catch (error) {
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    res.redirect('/register');
  }
};

exports.login = async (req, res) => {
  res.render('pages/login', {
    title: 'Login',
  });
};

exports.doLogin = async (req, res) => {
  try {
    const payload = req.body;
    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOneBy({ email: payload.email });

    if (!user) {
      req.flash('errorMessage', 'User tidak ditemukan');
      return res.redirect('/login');
    }

    if (user.password !== payload.password) {
      req.flash('errorMessage', 'Password salah');
      return res.redirect('/login');
    }

    req.session.user = user;

    req.flash('successMessage', 'User berhasil login');
    if (user.role == 'admin') {
      res.redirect('/panel/dashboard');
    } else {
      res.redirect('/panel/profile');
    }
  } catch (error) {
    req.flash('errorMessage', 'Terjadi kesalahan');

    res.redirect('/login');
  }
};
