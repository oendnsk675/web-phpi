const { Like } = require('typeorm');
const AppDataSource = require('../configs/ormconfig');
const Product = require('../models/Product');
const { formatRupiah } = require('../utils/commons');
require('dotenv').config();

exports.getAll = async (req, res) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find({
      order: {
        updatedAt: 'DESC',
      },
      relations: ['banners', 'category'],
      take: 9,
    });

    return res.render('pages/home', {
      title: 'Home - PHPI',
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: formatRupiah(product.price),
        category: product.category.name || '-',
        banners: product.banners.map(
          (banner) => `${process.env.APP_URL}${banner.path}`,
        ),
      })),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.render('pages/errors/index');
  }
};
