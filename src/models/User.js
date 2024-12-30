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
    status: {
      type: 'enum',
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    role: {
      type: 'enum',
      enum: ['admin', 'user'],
      default: 'user',
    },
    photo: {
      type: 'varchar',
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
});

module.exports = User;
