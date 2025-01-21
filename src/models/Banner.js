const { EntitySchema } = require('typeorm');

const Banner = new EntitySchema({
  name: 'Banner',
  tableName: 'banners',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    path: {
      type: 'varchar',
    },
    productId: {
      type: 'int',
      nullable: true,
    },
  },
  relations: {
    product: {
      type: 'many-to-one',
      target: 'Product',
      joinColumn: { name: 'productId', referencedColumnName: 'id' },
      cascade: true,
      onDelete: 'CASCADE',
    },
  },
});

module.exports = Banner;
