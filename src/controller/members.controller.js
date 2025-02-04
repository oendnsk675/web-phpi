const AppDataSource = require('../configs/ormconfig');
const User = require('../models/User');
require('dotenv').config();

const { Like } = require('typeorm'); // Pastikan untuk mengimpor Like dari TypeORM
const { createMemberCard } = require('../utils/qrcode');
const Product = require('../models/Product');
const { formatRupiah } = require('../utils/commons');
const Category = require('../models/Category');
const Language = require('../models/Language');
const SpecialInterest = require('../models/SpecialInterest');

exports.getAllMember = async (req, res) => {
  try {
    // Mengambil parameter pencarian dari query string
    const email = req.query.email || '';
    const nama = req.query.nama || '';
    const status = req.query.status || '';

    const userRepository = AppDataSource.getRepository(User);

    const itemsPerPage = 10;
    const currentPage = parseInt(req.query.page) || 1;
    const offset = (currentPage - 1) * itemsPerPage;

    // Filter berdasarkan query pencarian jika ada
    const whereClause = {};
    if (email) whereClause.email = Like(`%${email}%`);
    if (nama) whereClause.nama = Like(`%${nama}%`);
    if (status) whereClause.status = Like(`%${status}%`);

    // Hitung jumlah total item yang sesuai dengan filter
    const totalItems = await userRepository.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Ambil data pengguna berdasarkan filter dan pagination
    const users = await userRepository.find({
      where: whereClause,
      order: {
        updatedAt: 'DESC',
      },
      skip: offset,
      take: itemsPerPage,
    });

    // Kirim data ke EJS
    res.render('pages/members', {
      title: 'Members',
      users,
      currentPage,
      totalPages,
      email,
      nama,
      status,
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
    const dataSpecialInterest = await AppDataSource.getRepository(SpecialInterest).find();

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
      .leftJoinAndSelect('user.products', 'product') // Relasi ke Product
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('user.languages', 'language') // Relasi ke Product
      .leftJoinAndSelect('user.specialInterest', 'specialInterest') // Relasi ke Product
      .skip(offset)
      .take(itemsPerPage);

    if (nama) {
      query.where('user.nama LIKE :nama', { nama: `%${nama}%` });
    }
    if (location) {
      query.andWhere('product.location LIKE :location', { location: `%${location}%` });
    }
    if (language) {
      query.andWhere('language.language LIKE :language', { language: `%${language}%` });
    }
    if (specialInterest) {
      query.andWhere('specialInterest.name LIKE :specialInterest', {
        specialInterest: `%${specialInterest}%`,
      });
    }
    if (category) {
      query.andWhere('category.name LIKE :category', { category: `%${category}%` });
    }

    const users = await query.getMany();

    // Hitung total data untuk pagination
    const totalItems = await query.getCount();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const dataLanguage = await AppDataSource.getRepository(Language).find();
    const dataCategory = await AppDataSource.getRepository(Category).find();
    const dataSpecialInterest = await AppDataSource.getRepository(SpecialInterest).find();

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
    });
  } catch (error) {
    console.error('Error fetching users:', error);
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
      relations: ['languages'],
    });

    user.photo_ = user.photo;
    if (user && user.photo) {
      user.photo = `${process.env.APP_URL}${user.photo}`;
    }

    user.qr_url = `${process.env.APP_URL}/profile/${user.id}`;

    const memberCard = await createMemberCard({
      id: user.id,
      email: user.email,
      name: user.nama,
      phone: user.no_telp,
      qrData: user.qr_url,
      photo: user.photo_,
      status: user.status,
    });

    if (memberCard) {
      user.memberCard = `${process.env.APP_URL}/uploads/member-card/${user.id}.png`;
    }

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
      user,
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: formatRupiah(product.price),
        category: product.category.name || '-',
        banners: product.banners.map((banner) => `${process.env.APP_URL}${banner.path}`),
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
