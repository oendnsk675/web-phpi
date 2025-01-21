const Language = require('../models/Language'); // Sesuaikan dengan path yang benar
const AppDataSource = require('../configs/ormconfig');

async function seed() {
  await AppDataSource.initialize();

  const languageRepository = AppDataSource.getRepository(Language);

  // Menambahkan beberapa data bahasa contoh
  const languages = [
    { language: 'English' },
    { language: 'Indonesia' },
    { language: 'China' },
    { language: 'Japan' },
    { language: 'Korea' },
  ];
  await languageRepository.save(languages);

  console.log('[seeder] Data bahasa berhasil ditambahkan');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error during seeding:', error);
});
