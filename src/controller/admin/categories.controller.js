const { In, Like } = require('typeorm');
const AppDataSource = require('../../configs/ormconfig');
const Category = require('../../models/Category');

exports.getAll = async (req, res) => {
  try {
    const start = req.query.start || 0;
    const length = req.query.length || 10;
    const searchValue = req.query.search?.value || '';

    const categoryRepository = AppDataSource.getRepository(Category);

    const totalRecords = await categoryRepository.count();
    const categories = await categoryRepository.find({
      where: {
        name: searchValue ? Like(`%${searchValue}%`) : undefined,
      },
      order: {
        updatedAt: 'DESC',
      },
    });
    if (req.xhr) {
      return res.json({
        draw: req.query.draw,
        recordsTotal: totalRecords,
        recordsFiltered: totalRecords,
        data: categories.map((category) => ({
          id: category.id,
          name: category.name,
          description: category.description,
        })),
      });
    } else {
      res.render('pages/panel/category/index', {
        layout: 'layouts/dashboard',
        title: 'Categories',
        categories,
      });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.render('pages/errors/index');
  }
};

exports.create = async (req, res) => {
  try {
    res.render('pages/panel/category/create', {
      layout: 'layouts/dashboard',
      title: 'Categories',
      category: null,
      type: 'create',
    });
  } catch (error) {
    return res.render('pages/errors/index');
  }
};

exports.save = async (req, res) => {
  try {
    const payload = req.body;
    const categoryRepository = AppDataSource.getRepository(Category);
    await categoryRepository.save(payload);

    req.flash('successMessage', 'Data berhasil disimpan');

    return res.redirect('/panel/category');
  } catch (error) {
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/category/create');
  }
};

exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const categoryRepository = AppDataSource.getRepository(Category);
    const category = await categoryRepository.findOneBy({ id: id });

    return res.render('pages/panel/category/create', {
      layout: 'layouts/dashboard',
      title: 'Categories',
      category,
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

    const categoryRepository = queryRunner.manager.getRepository(Category);

    // Update data kategori
    await categoryRepository.update(id, payload);

    await queryRunner.commitTransaction(); // Commit transaksi

    req.flash('successMessage', 'Data berhasil di edit');

    return res.redirect('/panel/category');
  } catch (error) {
    await queryRunner.rollbackTransaction(); // Rollback transaksi jika ada error
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/category/create');
  } finally {
    await queryRunner.release(); // Pastikan query runner dilepas
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  const categoryRepository = AppDataSource.getRepository(Category);

  try {
    await categoryRepository.delete(id);
    req.flash('successMessage', 'Data berhasil dihapus');

    return res.redirect('/panel/category');
  } catch (error) {
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/category');
  }
};
