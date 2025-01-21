const { Like } = require('typeorm');
const AppDataSource = require('../configs/ormconfig');
const Product = require('../models/Product');
const { formatRupiah } = require('../utils/commons');
require('dotenv').config();

exports.getAll = async (req, res) => {
  try {
    const start = parseInt(req.query.page) - 1 || 0;
    const length = req.query.length || 9;
    const skip = start * length;
    const page = start + 1;
    const searchValue = req.query.search?.value || '';

    const productRepository = AppDataSource.getRepository(Product);

    const totalRecords = await productRepository.count();

    const products = await productRepository.find({
      where: {
        name: searchValue ? Like(`%${searchValue}%`) : undefined,
      },
      order: {
        updatedAt: 'DESC',
      },
      relations: ['banners', 'category'],
      skip,
      take: length,
    });

    if (req.xhr) {
      return res.json({
        draw: req.query.draw,
        recordsTotal: totalRecords,
        recordsFiltered: totalRecords,
        data: products.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: formatRupiah(product.price),
          category: product.category.name || '-',
        })),
      });
    } else {
      return res.render('pages/products', {
        title: 'List Products',
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
        page,
        limit: length,
        total: totalRecords,
        totalPage: Math.ceil(totalRecords / length),
        isFirstPage: page == 1,
      });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.render('pages/errors/index');
  }
};

exports.getDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository
      .findOne({
        where: { id },
        relations: ['banners', 'category'],
      })
      .then((product) => {
        return {
          ...product,
          banners: product.banners.map(
            (banner) => `${process.env.APP_URL}${banner.path}`,
          ),
          price: formatRupiah(product.price),
        };
      });
    return res.render('pages/detail-product', {
      title: 'Detail Product',
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.render('pages/errors/index');
  }
};
