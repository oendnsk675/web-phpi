const { EntitySchema, JoinColumn } = require('typeorm');

const Product = new EntitySchema({
  name: 'Product',
  tableName: 'products',
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
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
    rating: {
      type: 'decimal',
      precision: 3,
      scale: 2,
      nullable: true,
    },
    userId: {
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
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'userId', referencedColumnName: 'id' },
    },
    category: {
      type: 'many-to-one',
      target: 'Category',
      joinColumn: true,
    },
    banners: {
      type: 'one-to-many',
      target: 'Banner',
      inverseSide: 'product',
      nullable: true,
    },
  },
});

module.exports = Product;
