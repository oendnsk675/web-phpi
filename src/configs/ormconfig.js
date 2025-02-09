require('dotenv').config();
const { DataSource } = require('typeorm');
const User = require('../models/User');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
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
  ],
  migrations: [],
  subscribers: [],
});

module.exports = AppDataSource;
