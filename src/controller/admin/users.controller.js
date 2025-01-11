const AppDataSource = require('../../configs/ormconfig');
const User = require('../../models/User');
const { createMemberCard } = require('../../utils/qrcode');

exports.getAll = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      order: {
        updatedAt: 'DESC',
      },
    }); // Ambil semua data user
    res.render('pages/panel/members/index', {
      layout: 'layouts/dashboard',
      title: 'Members',
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.render('pages/errors/index');
  }
};

exports.create = async (req, res) => {
  try {
    res.render('pages/panel/members/create', {
      layout: 'layouts/dashboard',
      title: 'Members',
      user: null,
      type: 'create',
    });
  } catch (error) {
    return res.render('pages/errors/index');
  }
};

exports.save = async (req, res) => {
  try {
    const payload = req.body;
    if (req.file != undefined) {
      const imagePath = `/uploads/${req.file.filename}`;
      payload.photo = imagePath;
    }
    payload.status = 'active';

    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(payload);

    req.flash('successMessage', 'Data berhasil disimpan');

    return res.redirect('/panel/members/index');
  } catch (error) {
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/members/create');
  }
};

exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: id });

    return res.render('pages/panel/members/create', {
      layout: 'layouts/dashboard',
      title: 'Members',
      user,
      type: 'edit',
    });
  } catch (error) {
    return res.status(500).send('Error fetching users');
  }
};

exports.verify = async (req, res) => {
  try {
    const id = req.params.id;
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update({ id: id }, { status: 'active' });

    req.flash('successMessage', 'User berhasil di verifikasi');

    return res.redirect('/panel/members');
  } catch (error) {
    req.flash('errorMessage', 'User gagal di verifikasi');
    return res.redirect('/panel/members');
  }
};

exports.suspend = async (req, res) => {
  try {
    const id = req.params.id;
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update({ id: id }, { status: 'inactive' });

    req.flash('successMessage', 'User berhasil di suspend');

    return res.redirect('/panel/members');
  } catch (error) {
    req.flash('errorMessage', 'User gagal di suspend');
    return res.redirect('/panel/members');
  }
};

exports.update = async (req, res) => {
  try {
    const payload = req.body;
    const { id } = req.params;
    if (req.file != undefined) {
      const imagePath = `/uploads/${req.file.filename}`;
      payload.photo = imagePath;
    }
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update({ id: parseInt(id) }, payload);

    req.flash('successMessage', 'Data berhasil di edit');

    if (req.query.type == 'user') {
      return res.redirect('/panel/profile');
    }
    return res.redirect('/panel/members');
  } catch (error) {
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/members/create');
  }
};

exports.profile = async (req, res) => {
  try {
    const { id } = req.session.user;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: id });

    return res.render('pages/panel/members/profile', {
      layout: 'layouts/dashboard',
      title: 'Members',
      user,
      type: 'edit',
    });
  } catch (error) {
    return res.render('pages/errors/index');
  }
};
