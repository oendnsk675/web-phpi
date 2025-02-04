const { EntitySchema } = require('typeorm');

const Itinerary = new EntitySchema({
  name: 'Itinerary',
  tableName: 'itineraries',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    title: {
      type: 'varchar',
    },
    description: {
      type: 'text',
    },
    time: {
      type: 'varchar',
    },
    productId: {
      type: 'int',
    },
  },
  relations: {
    product: {
      type: 'many-to-one', // Banyak Itinerary untuk satu Product
      target: 'Product', // Target relasi ke entitas Product
      joinColumn: {
        name: 'productId', // Kolom foreign key di tabel Itinerarys
        referencedColumnName: 'id', // Referensi ke kolom id di tabel products
      },
      onDelete: 'CASCADE', // Opsional: menghapus layanan jika produk dihapus
    },
  },
});

module.exports = Itinerary;
