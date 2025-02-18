const { In, Like } = require('typeorm');
const AppDataSource = require('../../configs/ormconfig');
const Post = require('../../models/Post');
const Tag = require('../../models/Tag');
require('dotenv').config();

exports.getAll = async (req, res) => {
  try {
    const start = req.query.start || 0;
    const length = req.query.length || 10;
    const searchValue = req.query.search?.value || '';

    const repository = AppDataSource.getRepository(Post);

    const totalRecords = await repository.count();
    const posts = await repository.find({
      where: {
        name: searchValue ? Like(`%${searchValue}%`) : undefined,
      },
      relations: ['tags', 'author'],
      order: {
        updatedAt: 'DESC',
      },
      skip: start,
      take: length,
    });
    if (req.xhr) {
      return res.json({
        draw: req.query.draw,
        recordsTotal: totalRecords,
        recordsFiltered: totalRecords,
        data: posts.map((post) => ({
          ...post,
          thumbnail: `${process.env.APP_URL}${post.thumbnail}`,
        })),
      });
    } else {
      res.render('pages/panel/post/index', {
        layout: 'layouts/dashboard',
        title: 'Posts',
        posts,
      });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.render('pages/errors/index');
  }
};

exports.create = async (req, res) => {
  try {
    const tags = await AppDataSource.getRepository(Tag).find();

    res.render('pages/panel/post/create', {
      layout: 'layouts/dashboard',
      title: 'Posts',
      post: null,
      tags,
      type: 'create',
    });
  } catch (error) {
    return res.render('pages/errors/index');
  }
};

exports.save = async (req, res) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  const { id: userId } = req.session.user;

  try {
    const payload = req.body;
    let { tags } = payload;
    tags = Array.isArray(tags) ? tags : [tags];
    if (req.file != undefined) {
      const imagePath = `/uploads/${req.file.filename}`;
      payload.thumbnail = imagePath;
    }
    payload.published = payload.published ? true : false;

    const repository = queryRunner.manager.getRepository(Post);
    const tagRepository = queryRunner.manager.getRepository(Tag);

    if (tags && tags.length > 0) {
      delete payload.tags;
    }
    payload.authorId = userId;

    let post = await repository.save(payload);

    if (tags && tags.length > 0) {
      const existingData = await tagRepository.findBy({
        name: In(tags),
      });

      const missingData = tags.filter(
        (tag) => !existingData.some((existing) => existing.name === tag),
      );

      if (missingData.length > 0) {
        const newData = missingData.map((name) => ({
          name,
        }));

        await tagRepository.save(newData); // Menyimpan bahasa baru ke dalam tabel
      }

      const selectedData = await tagRepository.findBy({
        name: In(tags),
      });

      post.tags = selectedData;
      await repository.save(post);
    }

    await queryRunner.commitTransaction();

    req.flash('successMessage', 'Data berhasil disimpan');

    return res.redirect('/panel/post');
  } catch (error) {
    console.log(error);
    await queryRunner.rollbackTransaction();
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/post/create');
  } finally {
    await queryRunner.release();
  }
};

exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const repository = AppDataSource.getRepository(Post);
    const post = await repository.findOne({
      where: { id },
      relations: ['tags'],
    });
    const tags = await AppDataSource.getRepository(Tag).find();

    return res.render('pages/panel/post/create', {
      layout: 'layouts/dashboard',
      title: 'Posts',
      post,
      tags,
      type: 'edit',
    });
  } catch (error) {
    return res.status(500).send('Error fetching categories');
  }
};

exports.uploadImage = (req, res) => {
  let filename = req.file.filename;
  if (!filename) {
    res.status(500).json({ message: 'Failed to upload image' });
    return;
  }
  let url = `${process.env.APP_URL}/uploads/blog/${filename}`;
  return res.status(200).json({
    message: 'Successfully upload image',
    data: url,
  });
};

exports.update = async (req, res) => {
  const queryRunner = AppDataSource.createQueryRunner(); // Membuat query runner untuk transaksi
  await queryRunner.startTransaction(); // Mulai transaksi

  try {
    const payload = req.body;
    const { id } = req.params;
    let { tags } = payload;
    tags = Array.isArray(tags) ? tags : [tags];
    if (req.file != undefined) {
      const imagePath = `/uploads/${req.file.filename}`;
      payload.thumbnail = imagePath;
    }

    payload.published = payload.published ? true : false;

    if (tags && tags.length > 0) delete payload.tags;

    const repository = queryRunner.manager.getRepository(Post);
    const tagRepository = queryRunner.manager.getRepository(Tag);

    // Update data kategori
    await repository.update(id, payload);

    let post = await repository.findOne({
      where: { id: parseInt(id) },
      relations: ['tags'],
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (tags && tags.length > 0) {
      delete payload.tags;
    }

    if (tags && tags.length > 0) {
      const existingData = await tagRepository.findBy({
        name: In(tags),
      });

      const missingData = tags.filter(
        (tag) => !existingData.some((existing) => existing.name === tag),
      );

      if (missingData.length > 0) {
        const newData = missingData.map((name) => ({
          name,
        }));

        await tagRepository.save(newData); // Menyimpan bahasa baru ke dalam tabel
      }

      const selectedData = await tagRepository.findBy({
        name: In(tags),
      });

      post.tags = selectedData;
      await repository.save(post);
    }

    await queryRunner.commitTransaction(); // Commit transaksi

    req.flash('successMessage', 'Data berhasil di edit');

    return res.redirect('/panel/post');
  } catch (error) {
    await queryRunner.rollbackTransaction(); // Rollback transaksi jika ada error
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/post/create');
  } finally {
    await queryRunner.release(); // Pastikan query runner dilepas
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  const repository = AppDataSource.getRepository(Post);

  try {
    await repository.delete(id);
    req.flash('successMessage', 'Data berhasil dihapus');

    return res.redirect('/panel/post');
  } catch (error) {
    console.log(error);
    req.flash('errorMessage', 'Terjadi kesalahan');

    return res.redirect('/panel/post');
  }
};
