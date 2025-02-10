const { In, Like } = require('typeorm');
const AppDataSource = require('../../configs/ormconfig');
const ProductLocation = require('../../models/ProductLocation');
require('dotenv').config();

exports.getAll = async (req, res) => {
  try {
    const start = req.query.start || 0;
    const length = req.query.length || 10;
    const searchValue = req.query.search?.value || '';

    const repository = AppDataSource.getRepository(ProductLocation);

    const totalRecords = await repository.count();
    const locations = await repository.find({
      where: {
        name: searchValue ? Like(`%${searchValue}%`) : undefined,
      },
      skip: start,
      take: length,
    });
    if (req.xhr) {
      return res.json({
        draw: req.query.draw,
        recordsTotal: totalRecords,
        recordsFiltered: totalRecords,
        data: locations.map((location) => ({
          id: location.id,
          name: location.name,
          thumbnail: `${process.env.APP_URL}${location.thumbnail}`,
        })),
      });
    } else {
      res.render('pages/panel/location/index', {
        layout: 'layouts/dashboard',
        title: 'Locations',
        locations,
      });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.render('pages/errors/index');
  }
};

exports.create = async (req, res) => {
  try {
    res.render('pages/panel/location/create', {
      layout: 'layouts/dashboard',
      title: 'Locations',
      location: null,
      type: 'create',
    });
  } catch (error) {
    return res.render('pages/errors/index');
  }
};

exports.save = async (req, res) => {
  try {
    const payload = req.body;
    const repository = AppDataSource.getRepository(ProductLocation);

    // Cek apakah ada file yang diupload dan simpan gambar
    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      payload.thumbnail = imagePath;
    }
    console.log(payload, req.file);

    await repository.save(payload);

    req.flash('successMessage', 'Data berhasil disimpan');

    return res.redirect('/panel/location');
  } catch (error) {
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/location/create');
  }
};

exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const repository = AppDataSource.getRepository(ProductLocation);
    const location = await repository.findOneBy({ id: id });

    return res.render('pages/panel/location/create', {
      layout: 'layouts/dashboard',
      title: 'Locations',
      location,
      type: 'edit',
    });
  } catch (error) {
    return res.status(500).send('Error fetching categories');
  }
};

exports.update = async (req, res) => {
  const queryRunner = AppDataSource.createQueryRunner(); // Membuat query runner untuk transaksi
  await queryRunner.startTransaction(); // Mulai transaksi

  try {
    const payload = req.body;
    const { id } = req.params;

    // Cek apakah ada file yang diupload dan simpan gambar
    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      payload.thumbnail = imagePath;
    }

    console.log(payload, req.file);

    const repository = queryRunner.manager.getRepository(ProductLocation);

    await repository.update(id, payload);

    await queryRunner.commitTransaction();

    req.flash('successMessage', 'Data berhasil di edit');

    return res.redirect('/panel/location');
  } catch (error) {
    await queryRunner.rollbackTransaction(); // Rollback transaksi jika ada error
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/location/create');
  } finally {
    await queryRunner.release(); // Pastikan query runner dilepas
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  const repository = AppDataSource.getRepository(ProductLocation);

  try {
    await repository.delete(id);
    req.flash('successMessage', 'Data berhasil dihapus');

    return res.redirect('/panel/location');
  } catch (error) {
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/location');
  }
};
