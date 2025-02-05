const Category = require('../models/Category'); // Sesuaikan dengan path yang benar
const AppDataSource = require('../configs/ormconfig');

async function seed() {
  await AppDataSource.initialize();

  const categoryRepository = AppDataSource.getRepository(Category);

  const categories = [
    { name: 'Sejarah Budaya' },
    { name: 'Adventour' },
    { name: 'Shoping' },
    { name: 'Kuliner' },
  ];

  await categoryRepository.save(categories);

  console.log('[seeder] Data kategori berhasil ditambahkan');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error during seeding:', error);
});
