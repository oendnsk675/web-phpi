const { In, Like } = require('typeorm');
const AppDataSource = require('../../configs/ormconfig');
const Category = require('../../models/Category');
const User = require('../../models/User');
const Product = require('../../models/Product');
const ProductLocation = require('../../models/ProductLocation');
const Post = require('../../models/Post');

exports.getAllDashboard = async (req, res) => {
  try {
    const product = await AppDataSource.getRepository(Product).count();
    const user = await AppDataSource.getRepository(User).count();
    const location = await AppDataSource.getRepository(ProductLocation).count();
    const posts = await AppDataSource.getRepository(Post).count();

    res.render('pages/panel/dashboard/index', {
      layout: 'layouts/dashboard',
      title: 'Dashboard',
      product,
      user,
      location,
      posts,
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return res.render('pages/errors/index');
  }
};
