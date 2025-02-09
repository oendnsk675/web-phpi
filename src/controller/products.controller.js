const { Like } = require('typeorm');
const AppDataSource = require('../configs/ormconfig');
const Product = require('../models/Product');
const { formatRupiah } = require('../utils/commons');
const User = require('../models/User');
const Review = require('../models/Review');
const ProductLocation = require('../models/ProductLocation');
require('dotenv').config();

exports.getAll = async (req, res) => {
  try {
    const start = parseInt(req.query.page) - 1 || 0;
    const length = req.query.length || 9;
    const skip = start * length;
    const page = start + 1;
    const searchValue = req.query.search?.value || '';

    const productRepository = AppDataSource.getRepository(Product);
    const productLocationRepository =
      AppDataSource.getRepository(ProductLocation);
    const userRepository = AppDataSource.getRepository(User);

    const totalRecords = await productRepository.count();

    // Destinasi Terbaik
    const bestDestinations = await productLocationRepository
      .createQueryBuilder('productLocation')
      .leftJoin('productLocation.products', 'products')
      .leftJoin('products.reviews', 'reviews')
      .addSelect(
        'SUM(COUNT(reviews.id)) OVER (PARTITION BY productLocation.id)',
        'reviewCount',
      )
      .groupBy('productLocation.id')
      .orderBy('"reviewCount"', 'DESC')
      .take(9)
      .getRawMany();

    // Pengalam Terbaik
    const bestExperiences = await productRepository
      .createQueryBuilder('products')
      .leftJoin('products.reviews', 'reviews')
      .leftJoin('products.banners', 'banners')
      .addSelect(
        'SUM(COUNT(reviews.id)) OVER (PARTITION BY products.id)',
        'reviewCount',
      )
      .groupBy('products.id')
      .orderBy('"reviewCount"', 'DESC')
      .take(9)
      .getRawMany();

    const productIds = bestExperiences.map((d) => d.products_id);
    const banners = await productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.banners', 'banners')
      .where('products.id IN (:...productIds)', { productIds })
      .getMany();
    bestExperiences.forEach((destination) => {
      destination.banners = banners
        .filter((b) => b.id === destination.products_id)
        .map((b) => b.banners);
    });

    const popularUsers = await userRepository
      .createQueryBuilder('users')
      .leftJoin('users.products', 'products')
      .leftJoin('products.reviews', 'reviews')
      .addSelect('COALESCE(AVG(reviews.rating), 0)', 'averageRating')
      .groupBy('users.id')
      .orderBy('"averageRating"', 'DESC')
      .take(10)
      .getRawMany();

    console.log({ bestDestinations, bestExperiences, popularUsers });

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
        bestDestinations,
        bestExperiences,
        popularUsers,
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
        relations: [
          'banners',
          'category',
          'user',
          'user.languages',
          'productServices',
          'itineraries',
          'reviews',
          'reviews.user',
        ],
      })
      .then(async (product) => {
        let ratingUser = await AppDataSource.getRepository(Product).find({
          where: { user: { id: product.user.id } },
          relations: ['reviews'],
        });
        let ratingUserCount = 0;
        ratingUser = ratingUser
          .map((product) => {
            if (product.reviews.length > 0) {
              return (
                product.reviews.reduce((total, review) => {
                  ratingUserCount++;
                  return total + review.rating;
                }, 0) / product.reviews.length
              );
            }
            return 0;
          })
          .filter((rating) => rating > 0);

        if (ratingUser.length > 0) {
          ratingUser =
            ratingUser.reduce((total, rating) => total + rating, 0) /
            ratingUser.length;
        } else {
          ratingUser = 0;
        }

        return {
          ...product,
          banners: product.banners.map(
            (banner) => `${process.env.APP_URL}${banner.path}`,
          ),
          user: {
            ...product.user,
            createdAt: product.user.createdAt.getFullYear(),
          },
          reviews: product.reviews.map((review) => ({
            ...review,
            user: {
              ...review.user,
              photo: `${process.env.APP_URL}${review?.user?.photo}`,
            },
            createdAt: new Intl.DateTimeFormat('id-ID', {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
            }).format(new Date(review.createdAt)),
          })),
          price: formatRupiah(product.price),
          ratingUser,
          ratingUserCount,
          rating:
            product.reviews.reduce(
              (total, review) => total + review.rating,
              0,
            ) / product.reviews.length,
        };
      });

    console.log({ ratingUser: product.ratingUserCount });

    return res.render('pages/detail-product', {
      title: 'Detail Product',
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.render('pages/errors/index');
  }
};
