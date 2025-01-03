const AppDataSource = require('../configs/ormconfig');
const User = require('../models/User');
require('dotenv').config();

const { Like } = require('typeorm'); // Pastikan untuk mengimpor Like dari TypeORM

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
    res.status(500).send('Error fetching users');
  }
};

exports.profileMember = async (req, res) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: id });

    if (user && user.photo) {
      user.photo = `${process.env.APP_URL}${user.photo}`;
    }

    res.render('pages/profile', {
      title: 'Members',
      user,
    });
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
};
