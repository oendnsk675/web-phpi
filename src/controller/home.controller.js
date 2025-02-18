const { Like } = require('typeorm');
const AppDataSource = require('../configs/ormconfig');
const Product = require('../models/Product');
const { formatRupiah } = require('../utils/commons');
const Post = require('../models/Post');
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

    const posts = await AppDataSource.getRepository(Post).find({
      where: { published: true },
      order: { createdAt: 'DESC' },
      take: 4,
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
      posts: posts.map((post) => ({
        ...post,
        thumbnail: `${process.env.APP_URL}${post.thumbnail}`,
        title:
          post.title.length > 30 ? `${post.title.slice(0, 30)}...` : post.title,
        summary:
          post.summary.length > 100
            ? `${post.summary.slice(0, 100)}...`
            : post.summary,
        createdAt: post.createdAt.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      })),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.render('pages/errors/index');
  }
};
