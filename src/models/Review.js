const { EntitySchema } = require('typeorm');

const Review = new EntitySchema({
  name: 'Review',
  tableName: 'reviews',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    rating: {
      type: 'int',
      nullable: false,
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
    product: {
      type: 'many-to-one',
      target: 'Product',
      joinColumn: { name: 'productId', referencedColumnName: 'id' },
    },
  },
});

module.exports = Review;
