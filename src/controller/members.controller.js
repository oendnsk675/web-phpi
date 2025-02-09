const AppDataSource = require('../configs/ormconfig');
const User = require('../models/User');
require('dotenv').config();

const { Like } = require('typeorm'); // Pastikan untuk mengimpor Like dari TypeORM
const { createMemberCard } = require('../utils/qrcode');
const Product = require('../models/Product');
const { formatRupiah, formatPhoneNumber } = require('../utils/commons');
const Category = require('../models/Category');
const Language = require('../models/Language');
const SpecialInterest = require('../models/SpecialInterest');
const UserAvailableAreas = require('../models/UserAvailableAreas');

exports.getAllMember = async (req, res) => {
  try {
    // Mengambil parameter pencarian dari query string
    const nama = req.query.nama || '';
    const location = req.query.location || '';
    const language = req.query.language || '';
    const category = req.query.category || '';
    const specialInterest = req.query.specialInterest || '';

    const userRepository = AppDataSource.getRepository(User);
    const itemsPerPage = 10;
    const currentPage = parseInt(req.query.page) || 1;
    const offset = (currentPage - 1) * itemsPerPage;

    // Query Builder
    const query = userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.products', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .leftJoinAndSelect('user.languages', 'language')
      .leftJoinAndSelect('user.specialInterest', 'specialInterest')
      .leftJoinAndSelect('user.availableAreas', 'availableAreas')
      .skip(offset)
      .take(itemsPerPage);

    if (nama) {
      query.where('user.nama ILIKE :nama', { nama: `%${nama}%` });
    }
    if (location) {
      query.andWhere('availableAreas.name LIKE :location', {
        location: `%${location}%`,
      });
    }
    if (language) {
      query.andWhere('language.language LIKE :language', {
        language: `%${language}%`,
      });
    }
    if (specialInterest) {
      query.andWhere('specialInterest.name LIKE :specialInterest', {
        specialInterest: `%${specialInterest}%`,
      });
    }
    if (category) {
      query.andWhere('category.name LIKE :category', {
        category: `%${category}%`,
      });
    }

    let users = await query.getMany();
    users = users.map((user) => {
      const products = user.products;
      let countReview = 0;
      const productRatings = products.map((product) => {
        if (!product.reviews || product.reviews.length === 0) return 0;
        const totalRating = product.reviews.reduce((sum, review) => {
          countReview++;
          return sum + review.rating;
        }, 0);
        return totalRating / product.reviews.length;
      });
      const avgRating =
        productRatings.length > 0
          ? productRatings.reduce((sum, rating) => sum + rating, 0) /
            productRatings.length
          : 0;

      return {
        ...user,
        avgRating,
        countReview,
      };
    });

    const totalItems = await query.getCount();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (req.xhr || req.headers.accept.includes('json')) {
      return res.json({
        success: true,
        users,
        currentPage,
        totalPages,
      });
    }

    const dataLanguage = await AppDataSource.getRepository(Language).find();
    const dataCategory = await AppDataSource.getRepository(Category).find();
    const dataSpecialInterest =
      await AppDataSource.getRepository(SpecialInterest).find();
    const dataAvailableAreas =
      await AppDataSource.getRepository(UserAvailableAreas).find();

    res.render('pages/members', {
      title: 'Member',
      users,
      currentPage,
      totalPages,
      nama,
      location,
      language,
      dataLanguage,
      dataCategory,
      category,
      dataSpecialInterest,
      specialInterest,
      dataAvailableAreas,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.render('pages/errors/index');
  }
};

exports.findYourGuide = async (req, res) => {
  try {
    const dataLanguage = await AppDataSource.getRepository(Language).find();
    const dataCategory = await AppDataSource.getRepository(Category).find();
    const dataSpecialInterest =
      await AppDataSource.getRepository(SpecialInterest).find();

    res.render('pages/findYourGuide', {
      title: 'Find Your Guide',
      dataLanguage,
      dataCategory,
      dataSpecialInterest,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.render('pages/errors/index');
  }
};

exports.searchGuide = async (req, res) => {
  try {
    const nama = req.query.nama || '';
    const location = req.query.location || '';
    const language = req.query.language || '';
    const category = req.query.category || '';
    const specialInterest = req.query.specialInterest || '';

    const userRepository = AppDataSource.getRepository(User);
    const itemsPerPage = 10;
    const currentPage = parseInt(req.query.page) || 1;
    const offset = (currentPage - 1) * itemsPerPage;

    // Query Builder
    const query = userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.products', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .leftJoinAndSelect('user.languages', 'language')
      .leftJoinAndSelect('user.specialInterest', 'specialInterest')
      .leftJoinAndSelect('user.availableAreas', 'availableAreas')
      .skip(offset)
      .take(itemsPerPage);

    if (nama) {
      query.where('user.nama ILIKE :nama', { nama: `%${nama}%` });
    }
    if (location) {
      query.andWhere('availableAreas.name LIKE :location', {
        location: `%${location}%`,
      });
    }
    if (language) {
      query.andWhere('language.language LIKE :language', {
        language: `%${language}%`,
      });
    }
    if (specialInterest) {
      query.andWhere('specialInterest.name LIKE :specialInterest', {
        specialInterest: `%${specialInterest}%`,
      });
    }
    if (category) {
      query.andWhere('category.name LIKE :category', {
        category: `%${category}%`,
      });
    }

    let users = await query.getMany();
    users = users.map((user) => {
      const products = user.products;
      let countReview = 0;
      const productRatings = products.map((product) => {
        if (!product.reviews || product.reviews.length === 0) return 0;
        const totalRating = product.reviews.reduce((sum, review) => {
          countReview++;
          return sum + review.rating;
        }, 0);
        return totalRating / product.reviews.length;
      });
      const avgRating =
        productRatings.length > 0
          ? productRatings.reduce((sum, rating) => sum + rating, 0) /
            productRatings.length
          : 0;

      return {
        ...user,
        avgRating,
        countReview,
      };
    });

    const totalItems = await query.getCount();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (req.xhr || req.headers.accept.includes('json')) {
      return res.json({
        success: true,
        users,
        currentPage,
        totalPages,
      });
    }

    const dataLanguage = await AppDataSource.getRepository(Language).find();
    const dataCategory = await AppDataSource.getRepository(Category).find();
    const dataSpecialInterest =
      await AppDataSource.getRepository(SpecialInterest).find();
    const dataAvailableAreas =
      await AppDataSource.getRepository(UserAvailableAreas).find();

    res.render('pages/searchGuide', {
      title: 'Find Your Guide',
      users,
      currentPage,
      totalPages,
      nama,
      location,
      language,
      dataLanguage,
      dataCategory,
      category,
      dataSpecialInterest,
      specialInterest,
      dataAvailableAreas,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    if (req.xhr || req.headers.accept.includes('json')) {
      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error' });
    }
    res.render('pages/errors/index');
  }
};

exports.profileMember = async (req, res) => {
  try {
    const { id } = req.params;
    const start = parseInt(req.query.page) - 1 || 0;
    const length = req.query.length || 9;
    const skip = start * length;
    const page = start + 1;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
      relations: ['languages', 'availableAreas', 'specialInterest'],
    });

    user.photo_ = user.photo;
    if (user && user.photo) {
      user.photo = `${process.env.APP_URL}${user.photo}`;
    }

    // user.qr_url = `${process.env.APP_URL}/profile/${user.id}`;

    // const memberCard = await createMemberCard({
    //   id: user.id,
    //   email: user.email,
    //   name: user.nama,
    //   phone: formatPhoneNumber(user.no_telp),
    //   qrData: user.qr_url,
    //   photo: user.photo,
    //   status: user.status,
    // });

    // if (memberCard) {
    //   user.memberCard = `${process.env.APP_URL}/uploads/member-card/${user.id}.png`;
    // }

    const productRepository = AppDataSource.getRepository(Product);

    const totalRecords = await productRepository.count({
      where: {
        userId: user.id,
      },
    });
    const products = await productRepository.find({
      where: {
        userId: user.id,
      },
      order: {
        updatedAt: 'DESC',
      },
      relations: ['banners', 'category'],
      skip,
      take: length,
    });

    res.render('pages/profile', {
      title: `Profile - ${user.nama}` || 'Profile',
      user: {
        ...user,
        no_telp: formatPhoneNumber(user.no_telp),
      },
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: formatRupiah(product.price),
        category: product.category.name || '-',
        banners: product.banners.map(
          (banner) => `${process.env.APP_URL}${banner.path}`,
        ),
      })),
      page,
      limit: length,
      total: totalRecords,
      totalPage: Math.ceil(totalRecords / length),
      isFirstPage: page == 1,
    });
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
    return res.render('pages/errors/index');
  }
};
