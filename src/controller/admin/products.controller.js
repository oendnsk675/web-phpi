const { Like } = require('typeorm');
const AppDataSource = require('../../configs/ormconfig');
const Banner = require('../../models/Banner');
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const User = require('../../models/User');
require('dotenv').config();

exports.getAll = async (req, res) => {
  try {
    const start = req.query.start || 0;
    const length = req.query.length || 10;
    const searchValue = req.query.search?.value || '';

    const productRepository = AppDataSource.getRepository(Product);

    const totalRecords = await productRepository.count({
      where: { userId: req.session.user.id },
    });

    const products = await productRepository.find({
      where: {
        userId: req.session.user.id,
        name: searchValue ? Like(`%${searchValue}%`) : undefined,
      },
      order: {
        updatedAt: 'DESC',
      },
      relations: ['banners', 'category'],
      skip: start,
      take: length,
    });

    if (req.xhr) {
      return res.json({
        draw: req.query.draw,
        recordsTotal: totalRecords,
        recordsFiltered: totalRecords,
        data: products.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category.name || '-',
        })),
      });
    } else {
      return res.render('pages/panel/products/index', {
        layout: 'layouts/dashboard',
        title: 'Products',
        products,
        page: start,
        limit: length,
        total: totalRecords,
      });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.render('pages/errors/index');
  }
};

exports.create = async (req, res) => {
  try {
    const categoryRepository = AppDataSource.getRepository(Category);
    const categories = await categoryRepository.find();

    return res.render('pages/panel/products/create', {
      layout: 'layouts/dashboard',
      title: 'Products',
      product: null,
      type: 'create',
      categories,
    });
  } catch (error) {
    console.log({ error });
    return res.render('pages/errors/index');
  }
};

exports.save = async (req, res) => {
  try {
    const { id } = req.session.user;
    let payload = req.body;
    const files = req.files;

    const user = await AppDataSource.getRepository(User).findOneBy({
      id,
    });

    payload.user = user;

    if (payload.category) {
      payload.category = await AppDataSource.getRepository(Category).findOneBy({
        id: payload.category,
      });
    }

    // Simpan product terlebih dahulu
    payload.status = 'active';
    const productRepository = AppDataSource.getRepository(Product);
    const savedProduct = await productRepository.save(payload);

    // Jika ada files (banner), simpan setelah product
    if (files != undefined && files.length > 0) {
      const bannerRepository = AppDataSource.getRepository(Banner);

      // Simpan banner dan hubungkan dengan product yang baru saja disimpan
      await Promise.all(
        files.map(async (file) => {
          const imagePath = `/uploads/${file.filename}`;

          const banner = bannerRepository.create({
            path: imagePath,
            product: savedProduct,
          });

          return await bannerRepository.save(banner);
        }),
      );
    }

    req.flash('successMessage', 'Data berhasil disimpan');
    return res.redirect('/panel/products');
  } catch (error) {
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');
    return res.redirect('/panel/products/create');
  }
};

exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository
      .findOne({
        where: { id },
        relations: ['banners', 'category'],
      })
      .then((product) => {
        return {
          ...product,
          banners: product.banners.map(
            (banner) => `${process.env.APP_URL}${banner.path}`,
          ),
        };
      });
    const categoryRepository = AppDataSource.getRepository(Category);
    const categories = await categoryRepository.find();

    return res.render('pages/panel/products/create', {
      layout: 'layouts/dashboard',
      title: 'Products',
      product,
      type: 'edit',
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error fetching products');
  }
};

exports.update = async (req, res) => {
  const queryRunner = AppDataSource.createQueryRunner(); // Membuat query runner untuk transaksi
  await queryRunner.startTransaction(); // Mulai transaksi
  const files = req.files;

  try {
    const payload = req.body;
    const { id } = req.params;

    if (payload.category) {
      payload.category = await AppDataSource.getRepository(Category).findOneBy({
        id: payload.category,
      });
    }

    const productRepository = queryRunner.manager.getRepository(Product);

    // Update data product
    await productRepository.update(id, payload);
    const product = await productRepository.findOneBy({ id });

    // Jika ada files (banner), simpan setelah product
    if (files != undefined && files.length > 0) {
      const bannerRepository = AppDataSource.getRepository(Banner);

      // Simpan banner dan hubungkan dengan product yang baru saja disimpan
      bannerRepository.delete({ product });
      await Promise.all(
        files.map(async (file) => {
          const imagePath = `/uploads/${file.filename}`;

          const banner = bannerRepository.create({
            path: imagePath,
            product,
          });

          return await bannerRepository.save(banner);
        }),
      );
    }

    await queryRunner.commitTransaction(); // Commit transaksi

    req.flash('successMessage', 'Data berhasil di edit');

    return res.redirect('/panel/products');
  } catch (error) {
    await queryRunner.rollbackTransaction(); // Rollback transaksi jika ada error
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/products/create');
  } finally {
    await queryRunner.release(); // Pastikan query runner dilepas
  }
};

exports.delete = async (req, res) => {
  const queryRunner = AppDataSource.createQueryRunner(); // Membuat query runner untuk transaksi
  await queryRunner.startTransaction(); // Mulai transaksi

  try {
    const { id } = req.params;
    const productRepository = queryRunner.manager.getRepository(Product);

    await productRepository.delete(id);

    await queryRunner.commitTransaction(); // Commit transaksi

    req.flash('successMessage', 'Data berhasil dihapus');

    return res.redirect('/panel/products');
  } catch (error) {
    await queryRunner.rollbackTransaction(); // Rollback transaksi jika ada error
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/products');
  } finally {
    await queryRunner.release(); // Pastikan query runner dilepas
  }
};
