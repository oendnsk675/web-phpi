const { In, Like } = require('typeorm');
const AppDataSource = require('../../configs/ormconfig');
const Category = require('../../models/Category');
const User = require('../../models/User');
const Product = require('../../models/Product');
const ProductLocation = require('../../models/ProductLocation');

exports.getAllDashboard = async (req, res) => {
  try {
    const product = await AppDataSource.getRepository(Product).count();
    const user = await AppDataSource.getRepository(User).count();
    const location = await AppDataSource.getRepository(ProductLocation).count();
    const categories = await AppDataSource.getRepository(Category).count();

    res.render('pages/panel/dashboard/index', {
      layout: 'layouts/dashboard',
      title: 'Dashboard',
      product,
      user,
      location,
      categories,
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return res.render('pages/errors/index');
  }
};
