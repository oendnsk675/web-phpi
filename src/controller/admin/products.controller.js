const { Like } = require('typeorm');
const AppDataSource = require('../../configs/ormconfig');
const Banner = require('../../models/Banner');
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const User = require('../../models/User');
const ProductService = require('../../models/ProductServices');
const Itinerary = require('../../models/Itinerary');
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
    const productServiceRepository =
      AppDataSource.getRepository(ProductService);
    const categories = await categoryRepository.find();
    const productServices = await productServiceRepository.find();

    return res.render('pages/panel/products/create', {
      layout: 'layouts/dashboard',
      title: 'Products',
      product: null,
      type: 'create',
      categories,
      productServices,
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
    let { inclusions, exclusions } = payload;

    inclusions = inclusions
      ? Array.isArray(inclusions)
        ? inclusions
        : [inclusions]
      : [];
    exclusions = exclusions
      ? Array.isArray(exclusions)
        ? exclusions
        : [exclusions]
      : [];

    delete payload.inclusions;
    delete payload.exclusions;

    const user = await AppDataSource.getRepository(User).findOneBy({ id });
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

    const productServiceRepository =
      AppDataSource.getRepository(ProductService);
    const servicesToInsert = [];

    // Handle inclusions
    if (inclusions.length > 0) {
      inclusions.forEach((name) => {
        servicesToInsert.push({
          name,
          type: 'inclusive',
          product: savedProduct,
        });
      });
    }

    // Handle exclusions
    if (exclusions.length > 0) {
      exclusions.forEach((name) => {
        servicesToInsert.push({
          name,
          type: 'exclusive',
          product: savedProduct,
        });
      });
    }

    if (servicesToInsert.length > 0) {
      await productServiceRepository.save(servicesToInsert);
    }

    // Jika ada files (banner), simpan setelah product
    if (files && files.length > 0) {
      const bannerRepository = AppDataSource.getRepository(Banner);

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

    // Handle itineraries if provided
    if (payload.itineraries && Array.isArray(payload.itineraries)) {
      const itineraryRepository = AppDataSource.getRepository(Itinerary);
      const itinerariesToInsert = payload.itineraries.map(
        (itineraryData, index) => ({
          title: itineraryData.title,
          description: itineraryData.description,
          time: itineraryData.time,
          product: savedProduct,
        }),
      );

      if (itinerariesToInsert.length > 0) {
        await itineraryRepository.save(itinerariesToInsert);
      }
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
    const productServiceRepository =
      AppDataSource.getRepository(ProductService);
    const product = await productRepository
      .findOne({
        where: { id },
        relations: ['banners', 'category', 'productServices', 'itineraries'],
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
    const productServices = await productServiceRepository.find({
      where: { productId: product.id },
    });

    return res.render('pages/panel/products/create', {
      layout: 'layouts/dashboard',
      title: 'Products',
      product,
      type: 'edit',
      categories,
      productServices,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error fetching products');
  }
};

exports.update = async (req, res) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  const files = req.files;

  try {
    const payload = req.body;
    const { id } = req.params;
    let { inclusions, exclusions, itineraries } = payload;

    inclusions = inclusions
      ? Array.isArray(inclusions)
        ? inclusions
        : [inclusions]
      : [];
    exclusions = exclusions
      ? Array.isArray(exclusions)
        ? exclusions
        : [exclusions]
      : [];

    delete payload.inclusions;
    delete payload.exclusions;
    delete payload.itineraries;

    if (payload.category) {
      payload.category = await AppDataSource.getRepository(Category).findOneBy({
        id: payload.category,
      });
    }

    const productRepository = queryRunner.manager.getRepository(Product);
    const productServiceRepository =
      queryRunner.manager.getRepository(ProductService);

    // Update data product
    await productRepository.update(id, payload);
    const product = await productRepository.findOneBy({ id });

    // Hapus semua productServices terkait sebelum memasukkan yang baru
    await productServiceRepository.delete({ product: { id } });

    const servicesToInsert = [];

    // Handle inclusions
    if (inclusions.length > 0) {
      inclusions.forEach((name) => {
        servicesToInsert.push({
          name,
          type: 'inclusive',
          product,
        });
      });
    }

    // Handle exclusions
    if (exclusions.length > 0) {
      exclusions.forEach((name) => {
        servicesToInsert.push({
          name,
          type: 'exclusive',
          product,
        });
      });
    }

    if (servicesToInsert.length > 0) {
      await productServiceRepository.save(servicesToInsert);
    }

    // Jika ada files (banner), update banner
    if (files && files.length > 0) {
      const bannerRepository = queryRunner.manager.getRepository(Banner);

      await bannerRepository.delete({ product });

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

    if (itineraries && Array.isArray(itineraries)) {
      // Menggunakan repository untuk Itinerary
      const itineraryRepository = queryRunner.manager.getRepository(Itinerary);

      // Menghapus itineraries yang ada sebelum menambahkan yang baru
      await itineraryRepository.delete({ product: { id } });

      const itinerariesToInsert = itineraries.map((itineraryData) => ({
        title: itineraryData.title,
        description: itineraryData.description,
        time: itineraryData.time,
        product, // Referensi ke produk yang diperbarui
      }));

      // Menyimpan itineraries yang baru
      if (itinerariesToInsert.length > 0) {
        await itineraryRepository.save(itinerariesToInsert);
      }
    }

    await queryRunner.commitTransaction();

    req.flash('successMessage', 'Data berhasil di edit');
    return res.redirect('/panel/products');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');
    return res.redirect('/panel/products/create');
  } finally {
    await queryRunner.release();
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
