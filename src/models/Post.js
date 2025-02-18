const { EntitySchema } = require('typeorm');

const Post = new EntitySchema({
  name: 'Post',
  tableName: 'posts',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    title: {
      type: 'varchar',
      length: 255,
    },
    summary: {
      type: 'text',
      nullable: true,
    },
    thumbnail: {
      type: 'varchar',
      nullable: true,
    },
    content: {
      type: 'text',
    },
    published: {
      type: 'boolean',
      default: false,
    },
    authorId: {
      type: 'int',
      nullable: false,
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    author: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'authorId', referencedColumnName: 'id' },
    },
    tags: {
      type: 'many-to-many',
      target: 'Tag',
      joinTable: {
        name: 'post_tags',
      },
    },
    comments: {
      type: 'one-to-many',
      target: 'Comment',
      inverseSide: 'post',
    },
  },
});

module.exports = Post;
