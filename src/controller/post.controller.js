const { Like, Any, ILike } = require('typeorm');
const AppDataSource = require('../configs/ormconfig');
const Post = require('../models/Post');
const Tag = require('../models/Tag');
const Comment = require('../models/Comment');

require('dotenv').config();

exports.getAll = async (req, res) => {
  try {
    const start = req.query.start || 0;
    const length = req.query.length || 10;
    const title = req.query.title || '';
    const tag = req.query.tag || '';

    const repository = AppDataSource.getRepository(Post);

    const totalRecords = await repository.count();
    let whereCond = {};
    if (title) {
      whereCond.title = ILike(`%${title}%`);
    }
    if (tag) {
      whereCond.tags = { id: tag };
    }
    whereCond.published = true;

    const posts = await repository.find({
      where: whereCond,
      relations: ['tags', 'author'],
      order: {
        updatedAt: 'DESC',
      },
      skip: start,
      take: length,
    });

    const tags = await AppDataSource.getRepository(Tag).find();

    if (req.xhr) {
      return res.json({
        draw: req.query.draw,
        recordsTotal: totalRecords,
        recordsFiltered: totalRecords,
        data: posts.map((post) => ({
          ...post,
          thumbnail: `${process.env.APP_URL}${post.thumbnail}`,
          title:
            post.title.length > 30
              ? `${post.title.slice(0, 30)}...`
              : post.title,
          summary:
            post.summary.length > 100
              ? `${post.summary.slice(0, 100)}...`
              : post.summary,
        })),
        tags,
        tagSearch: tag,
        titleSearch: title,
      });
    } else {
      res.render('pages/blogs', {
        title: 'Blog',
        posts: posts.map((post) => ({
          ...post,
          thumbnail: `${process.env.APP_URL}${post.thumbnail}`,
          title:
            post.title.length > 30
              ? `${post.title.slice(0, 30)}...`
              : post.title,
          summary:
            post.summary.length > 100
              ? `${post.summary.slice(0, 100)}...`
              : post.summary,
        })),
        tags,
        tagSearch: tag,
        titleSearch: title,
      });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.render('pages/errors/index');
  }
};

exports.getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = AppDataSource.getRepository(Post);

    const post = await repository.findOne({
      relations: ['tags', 'author'],
      where: {
        id: parseInt(id),
        published: true,
      },
    });

    const relatedPosts = await repository.find({
      relations: ['tags'],
      where: {
        published: true,
        tags: {
          id: Any(post.tags.map((tag) => tag.id)),
        },
      },
      take: 5,
    });

    const tags = await AppDataSource.getRepository(Tag).find();

    const [comments, commentCount] = await AppDataSource.getRepository(
      Comment,
    ).findAndCount({
      relations: ['user', 'post'],
      where: {
        post: post.id,
      },
    });

    res.render('pages/detail-blogs', {
      title: 'Blog',
      post: {
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
      },
      tags,
      relatedPosts: relatedPosts.map((post) => ({
        ...post,
        title:
          post.title.length > 30 ? `${post.title.slice(0, 30)}...` : post.title,
        createdAt: post.createdAt.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      })),
      comments: comments.map((comment) => ({
        ...comment,
        createdAt:
          comment.createdAt
            .toLocaleString('id-ID', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
            .replace(',', '') +
          ' at ' +
          comment.createdAt
            .toLocaleString('id-ID', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
            .split(', '),
      })),
      commentCount,
    });
  } catch (error) {
    console.error('Error fetching detail post:', error);
    return res.render('pages/errors/index');
  }
};

exports.createComment = async (req, res) => {
  try {
    const { comment, postId } = req.body;
    const { id: userId } = req.session.user;

    const post = await AppDataSource.getRepository(Post).findOne({
      where: {
        id: parseInt(postId),
      },
    });
    if (!post) {
      req.flash('errorMessage', 'Post not found');
      return res.redirect(req.get('Referer'));
    }

    if (post.authorId == userId) {
      req.flash('errorMessage', 'You cannot comment your own post');
      return res.redirect(req.get('Referer'));
    }

    await AppDataSource.getRepository(Comment).save({
      comment,
      userId,
    });

    req.flash('successMessage', 'Comment created successfully');
    return res.redirect(req.get('Referer'));
  } catch (error) {
    console.error('Error create comment:', error);
    return res.render('pages/errors/index');
  }
};
