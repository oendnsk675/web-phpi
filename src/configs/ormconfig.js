require('dotenv').config();
const { DataSource } = require('typeorm');
const AddNoKTPandNIPatUserTable1753880113435 = require('../migrations/1753880113435-AddNoKTPandNIPatUserTable');
const AddColumnsProvinceCodeAndKabKotaCodeAtUserTable1753881394840 = require('../migrations/1753881394840-AddColumnsProvinceCodeAndKabKotaCodeAtUserTable');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5433,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  logging: false,
  entities: [
    require('../models/User'),
    require('../models/Language'),
    require('../models/UserAvailableAreas'),
    require('../models/SpecialInterest'),
    require('../models/Review'),
    require('../models/ProductServices'),
    require('../models/Itinerary'),
    require('../models/Product'),
    require('../models/Category'),
    require('../models/ProductLocation'),
    require('../models/Banner'),
    require('../models/Post'),
    require('../models/Tag'),
    require('../models/Comment'),
  ],
  migrations: [
    AddNoKTPandNIPatUserTable1753880113435,
    AddColumnsProvinceCodeAndKabKotaCodeAtUserTable1753881394840,
  ],
  subscribers: [],
});

module.exports = AppDataSource;
