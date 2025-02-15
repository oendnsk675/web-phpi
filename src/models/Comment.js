const { EntitySchema } = require('typeorm');

const Comment = new EntitySchema({
  name: 'Comment',
  tableName: 'comments',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    comment: {
      type: 'text',
      nullable: true,
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
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'userId', referencedColumnName: 'id' },
    },
    post: {
      type: 'many-to-one',
      target: 'Post',
      joinColumn: { name: 'postId', referencedColumnName: 'id' },
    },
  },
});

module.exports = Comment;
