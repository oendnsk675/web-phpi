const { EntitySchema, JoinColumn } = require('typeorm');

const Category = new EntitySchema({
  name: 'Category',
  tableName: 'categories',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    description: {
      type: 'text',
      nullable: true,
    },
    productId: {
      type: 'int',
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
    products: {
      type: 'one-to-many',
      target: 'Product',
      inverseSide: 'category',
    },
  },
});

module.exports = Category;
