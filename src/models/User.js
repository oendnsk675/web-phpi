const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
  name: 'User', // Nama entitas
  tableName: 'users', // Nama tabel di database
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    nama: {
      type: 'varchar',
    },
    no_telp: {
      type: 'varchar',
      unique: true,
    },
    password: {
      type: 'varchar',
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
});

module.exports = User;
