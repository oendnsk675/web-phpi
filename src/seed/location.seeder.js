const AppDataSource = require('../configs/ormconfig');
const ProductLocation = require('../models/ProductLocation');

async function seed() {
  await AppDataSource.initialize();

  const repos = AppDataSource.getRepository(ProductLocation);

  const locations = [{ name: 'Bali' }, { name: 'Lombok' }, { name: 'Makasar' }, { name: 'Jakarta' }, { name: 'Surabaya' }, { name: 'Bandung' }, { name: 'Yogyakarta' }, { name: 'Semarang' }, { name: 'Medan' }, { name: 'Palembang' }];
  await repos.save(locations);

  console.log('[seeder] Data location berhasil ditambahkan');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error during seeding:', error);
});
