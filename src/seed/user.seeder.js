const User = require('../models/User'); // Sesuaikan dengan path yang benar
const AppDataSource = require('../configs/ormconfig');

async function seed() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);

  // Menambahkan beberapa data pengguna contoh
  const users = {
    email: 'admin@example.com',
    nama: 'Admin',
    no_telp: '081234567890',
    password: 'password123', // Pastikan mengenkripsi password sebelum disimpan
    status: 'active',
    role: 'admin',
    photo: null,
    address: 'Jakarta',
    birthday: new Date('1990-01-01'),
    gender: 'male',
    lastEducation: 'SMA',
    trainingCertificationNumber: '1',
    competencyCertificationNumber: '1',
    qualification: '1',
    validUntil: new Date('2025-01-01'),
    languageSkill: 'English',
  };
  await userRepository.save(users);

  console.log('[seeder] Data pengguna berhasil ditambahkan');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error during seeding:', error);
});
