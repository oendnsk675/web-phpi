const { EntitySchema } = require('typeorm');

const ProductService = new EntitySchema({
  name: 'ProductService',
  tableName: 'productServices',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    type: {
      type: 'enum',
      enum: ['inclusive', 'exclusive'],
      default: 'inclusive',
    },
    productId: {
      type: 'int',
    },
  },
  relations: {
    product: {
      type: 'many-to-one', // Banyak ProductService untuk satu Product
      target: 'Product', // Target relasi ke entitas Product
      joinColumn: {
        name: 'productId', // Kolom foreign key di tabel productServices
        referencedColumnName: 'id', // Referensi ke kolom id di tabel products
      },
      onDelete: 'CASCADE', // Opsional: menghapus layanan jika produk dihapus
    },
  },
});

module.exports = ProductService;
