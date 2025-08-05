const { In, Like } = require('typeorm');
const AppDataSource = require('../../configs/ormconfig');
const Language = require('../../models/Language');
const User = require('../../models/User');
const { createMemberCard } = require('../../utils/qrcode');
const SpecialInterest = require('../../models/SpecialInterest');
const UserAvailableAreas = require('../../models/UserAvailableAreas');
const { generateNIP } = require('../../utils/commons');
const {
  fetchProvinces,
  fetchProvince,
  fetchRegency,
} = require('../../utils/http');

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

exports.getProvinces = async (req, res) => {
  try {
    const data = await fetchProvinces();
    if (data instanceof Error) throw data;
    res.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.render('pages/errors/index');
  }
};

exports.getRegencies = async (req, res) => {
  try {
    const provinceCode = req.query.province_code;
    const response = await fetch(
      `https://wilayah.id/api/regencies/${provinceCode}.json`,
    );
    const data = await response.json();
    res.json(data?.data);
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

/**
 * Generates a new NIP (Nomor Induk Pegawai) based on the provided kabkota_code
 * and an optional old NIP. The function constructs a prefix using the kabkota_code
 * and the current month and year, then finds the last user with a matching NIP
 * prefix to determine the next available serial number.
 *
 * @param {string} kabkota_code - The code representing the kabupaten/kota, which
 * must be at least 4 characters long.
 * @param {string|null} oldNip - An optional existing NIP to consider when generating
 * the new NIP. If provided, the serial number from the old NIP is used initially.
 * @returns {Promise<string|Error>} - Returns the newly generated NIP, or an Error
 * if the kabkota_code is invalid or another error occurs during the process.
 */

exports.createNIP = async (kabkota_code) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    if (!kabkota_code || kabkota_code.length < 4) {
      throw new Error('Invalid kabkota_code');
    }
    const prefix = `${kabkota_code}.${mm}${yy}`;
    const lastUser = await userRepository
      .createQueryBuilder('user')
      .where('user.nip LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('user.nip', 'DESC')
      .getOne();

    let counter = 1;
    if (lastUser?.nip) {
      const parts = lastUser.nip.split('.');
      const serialStr = parts[3];
      const lastCounter = parseInt(serialStr, 10);
      counter = isNaN(lastCounter) ? 1 : lastCounter + 1;
    }
    let result = generateNIP(kabkota_code, mm, yy, counter);

    return result;
  } catch (error) {
    return new Error(error);
  }
};

exports.save = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const languageRepository = AppDataSource.getRepository(Language);

    const payload = req.body;
    let { languages } = payload;
    languages = Array.isArray(languages) ? languages : [languages];

    if (languages && languages.length > 0) {
      delete payload.languages;
    }

    payload.status = 'active';

    const nip = await this.createNIP(payload.kabkota_code);
    payload.nip = nip;
    const nipExists = await userRepository.findOneBy({ nip: payload.nip });
    if (nipExists) {
      req.flash(
        'errorMessage',
        'Terjadi kesalahan generate NIP, silahkan coba lagi!',
      );
    }

    if (languages && languages.length > 0) {
      const selectedLanguages = await languageRepository.findBy({
        language: In(languages),
      });

      payload.languages = selectedLanguages;
    }

    await userRepository.save(payload);

    req.flash('successMessage', 'Data berhasil disimpan');

    return res.redirect('/panel/members');
  } catch (error) {
    console.error(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    const languageRepository = AppDataSource.getRepository(Language);

    const languages = await languageRepository.find();

    return res.render('pages/panel/members/create', {
      layout: 'layouts/dashboard',
      title: 'Members',
      user: req.body,
      type: 'create',
      languages,
    });
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
    const province_name = await fetchProvince(user.province_code);
    const kabkota_name = await fetchRegency(
      user.province_code,
      user.kabkota_code,
    );
    const userTransformed = {
      ...user,
      originalPhoto: user.photo,
      photo: user.photo ? `/uploads/photos/${user.photo}` : null,
      province_name,
      kabkota_name,
    };

    const languageRepository = AppDataSource.getRepository(Language);

    const languages = await languageRepository.find();

    return res.render('pages/panel/members/create', {
      layout: 'layouts/dashboard',
      title: 'Members',
      user: userTransformed,
      type: 'edit',
      languages,
    });
  } catch (error) {
    console.error(error);

    req.flash('errorMessage', 'Terjadi kesalahan ketika mengambil data user');
    return res.redirect('/panel/members');
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

exports.doDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete({ id });

    req.flash('successMessage', 'User berhasil di delete!');

    return res.redirect('/panel/members');
  } catch (error) {
    req.flash('errorMessage', 'User gagal di delete!');
    return res.redirect('/panel/members');
  }
};

exports.update = async (req, res) => {
  const queryRunner = AppDataSource.createQueryRunner(); // Membuat query runner untuk transaksi
  await queryRunner.startTransaction(); // Mulai transaksi

  const payload = req.body;
  const { id } = req.params;
  try {
    let { languages, specialInterest } = payload;

    if (languages && languages != undefined) {
      languages =
        languages && Array.isArray(languages) ? languages : [languages];
    }
    if (specialInterest && specialInterest != undefined) {
      specialInterest =
        specialInterest && Array.isArray(specialInterest)
          ? specialInterest
          : [specialInterest];
    }

    if (languages && languages.length > 0) {
      delete payload.languages;
    }

    if (specialInterest && specialInterest.length > 0) {
      delete payload.specialInterest;
    }

    const userRepository = queryRunner.manager.getRepository(User);
    const languageRepository = queryRunner.manager.getRepository(Language);
    const specialInterestRepository =
      queryRunner.manager.getRepository(SpecialInterest);

    // Ambil user yang akan diupdate languages, specialInterest, dan NIP jika ada perubahan kabkota_code
    const user = await userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['languages', 'specialInterest'],
    });

    if (user.kabkota_code != payload.kabkota_code) {
      const nip = await this.createNIP(payload.kabkota_code);
      if (nip instanceof Error) {
        throw new Error(nip.message);
      }
      payload.nip = nip;
      req.session.user.nip = nip;
    }

    // Update data pengguna (kecuali relasi languages)
    Object.assign(user, payload);
    await userRepository.save(user);

    if (!user) {
      throw new Error('User not found');
    }

    if (languages && languages.length > 0) {
      // saat ini ada dua kondisi dalam melakukan pengecekan, dikarnakan di fitur autofield ketika isi no_ktp, input languages send data languages dalam bentuk id, sebaliknya ketika menggunakan fitur edit tanpa autofield languages berisi text language nya.
      const existingLanguages = await languageRepository.find({
        where: { language: In(languages) },
      });

      const missingLanguages = languages.filter(
        (language) =>
          !existingLanguages.some((existing) => existing.language === language),
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
    console.log(error);

    await queryRunner.rollbackTransaction(); // Rollback transaksi jika ada error
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect(`/panel/members/edit/${id}`);
  } finally {
    await queryRunner.release(); // Pastikan query runner dilepas
  }
};

exports.updatePersonalProfile = async (req, res) => {
  const queryRunner = AppDataSource.createQueryRunner(); // Membuat query runner untuk transaksi
  await queryRunner.startTransaction(); // Mulai transaksi

  try {
    const payload = req.body;
    let { availableAreas } = payload;
    const { id } = req.params;

    availableAreas = Array.isArray(availableAreas)
      ? availableAreas
      : availableAreas !== undefined
        ? [availableAreas]
        : [];

    if (availableAreas && availableAreas.length > 0) {
      delete payload.availableAreas;
    }

    const userRepository = queryRunner.manager.getRepository(User);
    const availableAreasRepository =
      queryRunner.manager.getRepository(UserAvailableAreas);

    await queryRunner.manager.getRepository(User).update(id, payload);
    const user = await userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['availableAreas'],
    });

    if (availableAreas && availableAreas.length > 0) {
      const existingData = await availableAreasRepository.findBy({
        name: In(availableAreas),
      });

      const missingData = availableAreas.filter(
        (data) => !existingData.some((existing) => existing.name === data),
      );

      if (missingData.length > 0) {
        const newData = missingData.map((name) => ({
          name, // pastikan field yang benar digunakan sesuai model
        }));

        await availableAreasRepository.save(newData); // Menyimpan bahasa baru ke dalam tabel
      }

      const dataSelected = await availableAreasRepository.findBy({
        name: In(availableAreas),
      });

      user.availableAreas = dataSelected;
      await userRepository.save(user);
    }

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
      relations: ['languages', 'specialInterest', 'availableAreas'],
    });
    const languages = await languageRepository.find();
    const specialInterest =
      await AppDataSource.getRepository(SpecialInterest).find();
    const availableAreas =
      await AppDataSource.getRepository(UserAvailableAreas).find();

    const province_name = await fetchProvince(user.province_code);
    const kabkota_name = await fetchRegency(
      user.province_code,
      user.kabkota_code,
    );

    user.qr_url = `${process.env.APP_URL}/profile/${user.id}`;
    user.originalPhoto = user.photo;
    user.photo = user.photo ? `/uploads/photos/${user.photo}` : null;

    user.province_name = province_name;
    user.kabkota_name = kabkota_name;

    const memberCard = await createMemberCard({
      id: user.id,
      email: user.email,
      name: user.nama,
      phone: user.no_telp,
      qrData: user.qr_url,
      photo: user.photo,
      status: user.status,
      nip: user.nip,
      no_ktp: user.no_ktp,
    });
    if (memberCard) {
      user.memberCard = `${process.env.APP_URL}/uploads/member-card/${user.id}.png`;
    }

    return res.render('pages/panel/members/profile', {
      layout: 'layouts/dashboard',
      title: 'Members',
      user,
      languages,
      specialInterest,
      availableAreas,
      type: 'edit',
    });
  } catch (error) {
    console.error(error);
    req.flash('errorMessage', 'Terjadi kesalahan mengambil data!');
    return;
    // return res.render('pages/errors/index');
  }
};

exports.getUserByKtp = async (req, res) => {
  try {
    const no_ktp = req.params.no_ktp;
    const userRepository = AppDataSource.getRepository(User);
    const languageRepository = AppDataSource.getRepository(Language);
    const user = await userRepository.findOne({
      where: { no_ktp },
      relations: ['languages'],
    });
    const province_name = await fetchProvince(user.province_code);
    const kabkota_name = await fetchRegency(
      user.province_code,
      user.kabkota_code,
    );
    const userTransformed = {
      ...user,
      province_name,
      kabkota_name,
    };
    if (!user) throw new Error('User not found');
    const languages = await languageRepository.find();
    const data = {
      user: userTransformed,
      languages,
    };

    return res.json(data);
  } catch (error) {
    return res.status(404).json({ error: 'User not found' });
  }
};

exports.uploadFoto = async (req, res) => {
  try {
    const { user_id } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    const file = req.file;
    if (!file) throw new Error('File not found');

    if (user_id == 0) {
      return res.json({
        message: 'Foto berhasil diupload',
        filename: file.filename,
      });
    }
    const user = await userRepository.findOne({ where: { id: user_id } });
    if (!user) throw new Error('User not found');

    user.photo = file.filename;

    if (req.session.user.id == user_id) {
      req.session.user.photo = `/uploads/photos/${file.filename}`;
    }

    await userRepository.save(user);
    return res.json({
      message: 'Foto berhasil diupload dan disimpan',
      filename: file.filename,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({ error: 'User not found' });
  }
};
