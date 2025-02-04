const AppDataSource = require('../configs/ormconfig');
const Product = require('../models/Product');
const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { rating, comment, productId } = req.body;
  const { id: userId } = req.session.user; // Pastikan user sudah login, ambil dari token atau session

  try {
    const reviewRepository = AppDataSource.getRepository(Review);
    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOne({
      where: { id: productId },
      relations: ['user'],
    });
    if (!product) {
      req.flash('errorMessage', 'Product not found');
      return res.redirect(req.get('Referer'));
    }

    if (product.user.id == userId) {
      req.flash('errorMessage', 'You cannot review your own product');
      return res.redirect(req.get('Referer'));
    }

    const review = reviewRepository.create({
      rating,
      comment,
      user: { id: userId },
      product: { id: productId },
    });

    await reviewRepository.save(review);

    req.flash('successMessage', 'Review created successfully');
    return res.redirect(req.get('Referer'));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviewRepository = AppDataSource.getRepository(Review);
    const reviews = await reviewRepository.find({
      where: { productId },
      relations: ['user', 'product'],
    });
    return res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
