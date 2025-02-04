const { In, Like } = require('typeorm');
const AppDataSource = require('../../configs/ormconfig');
const Language = require('../../models/Language');
const User = require('../../models/User');
const { createMemberCard } = require('../../utils/qrcode');
const SpecialInterest = require('../../models/SpecialInterest');

exports.getAll = async (req, res) => {
  try {
    const start = req.query.start || 0;
    const length = req.query.length || 10;
    const searchValue = req.query.search?.value || '';

    const userRepository = AppDataSource.getRepository(User);

    const totalRecords = await userRepository.count();
    const users = await userRepository.find({
      where: {
        nama: searchValue ? Like(`%${searchValue}%`) : undefined,
      },
      order: {
        updatedAt: 'DESC',
      },
      skip: start,
      take: length,
    });

    if (req.xhr) {
      return res.json({
        draw: req.query.draw,
        recordsTotal: totalRecords,
        recordsFiltered: totalRecords,
        data: users.map((user) => ({
          id: user.id,
          nama: user.nama,
          email: user.email,
          no_telp: user.no_telp,
          status: user.status,
        })),
      });
    } else {
      return res.render('pages/panel/members/index', {
        layout: 'layouts/dashboard',
        title: 'Members',
        users,
        page: start,
        limit: length,
        total: totalRecords,
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.render('pages/errors/index');
  }
};

exports.create = async (req, res) => {
  try {
    const languageRepository = AppDataSource.getRepository(Language);

    const languages = await languageRepository.find();

    res.render('pages/panel/members/create', {
      layout: 'layouts/dashboard',
      title: 'Members',
      user: null,
      type: 'create',
      languages,
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

    return res.redirect('/panel/members');
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
    const user = await userRepository.findOne({
      where: { id },
      relations: ['languages'],
    });

    const languageRepository = AppDataSource.getRepository(Language);

    const languages = await languageRepository.find();

    return res.render('pages/panel/members/create', {
      layout: 'layouts/dashboard',
      title: 'Members',
      user,
      type: 'edit',
      languages,
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
  const queryRunner = AppDataSource.createQueryRunner(); // Membuat query runner untuk transaksi
  await queryRunner.startTransaction(); // Mulai transaksi

  try {
    const payload = req.body;
    const { id } = req.params;
    let { languages, specialInterest } = payload;

    languages = Array.isArray(languages) ? languages : [languages];
    specialInterest = Array.isArray(specialInterest) ? specialInterest : [specialInterest];

    if (languages && languages.length > 0) {
      delete payload.languages;
    }

    if (specialInterest && specialInterest.length > 0) {
      delete payload.specialInterest;
    }

    // Cek apakah ada file yang diupload dan simpan gambar
    if (req.file != undefined) {
      const imagePath = `/uploads/${req.file.filename}`;
      payload.photo = imagePath;
    }

    const userRepository = queryRunner.manager.getRepository(User);
    const languageRepository = queryRunner.manager.getRepository(Language);
    const specialInterestRepository = queryRunner.manager.getRepository(SpecialInterest);

    // Update data pengguna (kecuali relasi languages)
    await userRepository.update(id, payload);

    // Ambil user yang akan diupdate
    const user = await userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['languages'], // Mengambil relasi languages
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Cek apakah ada perubahan pada languages yang dikirimkan
    if (languages && languages.length > 0) {
      const existingLanguages = await languageRepository.findBy({
        language: In(languages),
      });

      const missingLanguages = languages.filter(
        (language) => !existingLanguages.some((existing) => existing.language === language),
      );

      if (missingLanguages.length > 0) {
        const newLanguages = missingLanguages.map((language) => ({
          language, // pastikan field yang benar digunakan sesuai model
        }));

        await languageRepository.save(newLanguages); // Menyimpan bahasa baru ke dalam tabel
      }

      const selectedLanguages = await languageRepository.findBy({
        language: In(languages),
      });

      user.languages = selectedLanguages;
      await userRepository.save(user);
    }

    // Cek apakah ada perubahan pada spesial interest yang dikirimkan
    if (specialInterest && specialInterest.length > 0) {
      const existingData = await specialInterestRepository.findBy({
        name: In(specialInterest),
      });

      const missingData = specialInterest.filter(
        (data) => !existingData.some((existing) => existing.name === data),
      );

      if (missingData.length > 0) {
        const newData = missingData.map((name) => ({
          name, // pastikan field yang benar digunakan sesuai model
        }));

        await specialInterestRepository.save(newData); // Menyimpan bahasa baru ke dalam tabel
      }

      const dataSelected = await specialInterestRepository.findBy({
        name: In(specialInterest),
      });

      user.specialInterest = dataSelected;
      await userRepository.save(user);
    }

    await queryRunner.commitTransaction(); // Commit transaksi

    req.flash('successMessage', 'Data berhasil di edit');

    if (req.query.type == 'user') {
      return res.redirect('/panel/profile');
    }
    return res.redirect('/panel/members');
  } catch (error) {
    await queryRunner.rollbackTransaction(); // Rollback transaksi jika ada error
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/members/create');
  } finally {
    await queryRunner.release(); // Pastikan query runner dilepas
  }
};

exports.updatePersonalProfile = async (req, res) => {
  const queryRunner = AppDataSource.createQueryRunner(); // Membuat query runner untuk transaksi
  await queryRunner.startTransaction(); // Mulai transaksi

  try {
    const payload = req.body;
    const { id } = req.params;

    await queryRunner.manager.getRepository(User).update(id, payload);

    await queryRunner.commitTransaction();

    req.flash('successMessage', 'Data personal berhasil di edit');

    if (req.query.type == 'user') {
      return res.redirect('/panel/profile');
    }
    return res.redirect('/panel/members');
  } catch (error) {
    await queryRunner.rollbackTransaction(); // Rollback transaksi jika ada error
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/members/create');
  } finally {
    await queryRunner.release(); // Pastikan query runner dilepas
  }
};

exports.profile = async (req, res) => {
  try {
    const { id } = req.session.user;
    const userRepository = AppDataSource.getRepository(User);
    const languageRepository = AppDataSource.getRepository(Language);
    const user = await userRepository.findOne({
      where: { id },
      relations: ['languages', 'specialInterest'],
    });
    const languages = await languageRepository.find();
    const specialInterest = await AppDataSource.getRepository(SpecialInterest).find();

    return res.render('pages/panel/members/profile', {
      layout: 'layouts/dashboard',
      title: 'Members',
      user,
      languages,
      specialInterest,
      type: 'edit',
    });
  } catch (error) {
    return res.render('pages/errors/index');
  }
};
