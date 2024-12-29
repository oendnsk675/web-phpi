const AppDataSource = require('../../configs/ormconfig');
const User = require('../../models/User');

exports.getAll = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find(); // Ambil semua data user
    res.render('pages/admin/members/index', {
      layout: 'layouts/dashboard',
      title: 'Members',
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
};

exports.create = async (req, res) => {
  try {
    res.render('pages/admin/members/create', {
      layout: 'layouts/dashboard',
      title: 'Members',
    });
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
};

exports.save = async (req, res) => {
  try {
    const payload = req.body;
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(payload);

    req.flash('successMessage', 'Data berhasil disimpan');

    res.redirect('/admin/members/create');
  } catch (error) {
    req.flash('errorMessage', 'Terjadi kesalahan');

    res.redirect('/admin/members/create');
  }
};
