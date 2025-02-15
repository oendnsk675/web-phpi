const { EntitySchema } = require('typeorm');

const Tag = new EntitySchema({
  name: 'Tag',
  tableName: 'tags',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 100,
      unique: true,
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
    posts: {
      type: 'many-to-many',
      target: 'Post',
      inverseSide: 'tags',
    },
  },
});

module.exports = Tag;
