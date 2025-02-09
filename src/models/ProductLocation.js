const { EntitySchema } = require('typeorm');

const ProductLocation = new EntitySchema({
  name: 'ProductLocation',
  tableName: 'productLocation',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
    },
  },
  relations: {
    products: {
      type: 'one-to-many',
      target: 'Product',
      inverseSide: 'location',
    },
  },
});

module.exports = ProductLocation;
