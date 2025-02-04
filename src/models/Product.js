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
    location: {
      type: 'varchar',
      nullable: true,
    },
    serviceTime: {
      type: 'varchar',
      nullable: true,
    },
    capacity: {
      type: 'int',
      nullable: true,
    },
    importantInformation: {
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
    productServices: {
      type: 'one-to-many',
      target: 'ProductService', // Target ke entitas ProductService
      inverseSide: 'product', // Harus sama dengan nama relasi di ProductService
      cascade: true, // Opsional: insert/update otomatis ke child entity
    },
    itineraries: {
      type: 'one-to-many',
      target: 'Itinerary', // Target ke entitas ProductService
      inverseSide: 'product', // Harus sama dengan nama relasi di ProductService
      cascade: true, // Opsional: insert/update otomatis ke child entity
    },
    reviews: {
      type: 'one-to-many',
      target: 'Review',
      inverseSide: 'product',
    },
  },
});

module.exports = Product;
