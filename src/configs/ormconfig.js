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
  entities: [require('../models/User')],
  migrations: [],
  subscribers: [],
});

module.exports = AppDataSource;
