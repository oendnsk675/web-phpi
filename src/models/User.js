const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    nama: {
      type: 'varchar',
    },
    address: {
      type: 'varchar',
      nullable: true,
    },
    birthday: {
      type: 'date',
      nullable: true,
    },
    gender: {
      type: 'enum',
      enum: ['male', 'female'],
      nullable: true,
    },
    no_telp: {
      type: 'varchar',
      nullable: true,
    },
    email: {
      type: 'varchar',
    },
    lastEducation: {
      type: 'enum',
      enum: ['SMA', 'D3', 'S1', 'S2', 'S3'],
      nullable: true,
    },
    trainingCertificationNumber: {
      type: 'varchar',
      nullable: true,
    },
    competencyCertificationNumber: {
      type: 'varchar',
      nullable: true,
    },
    qualification: {
      type: 'varchar',
      nullable: true,
    },
    validUntil: {
      type: 'date',
      nullable: true,
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
    educations: {
      type: 'text',
      nullable: true,
    },
    experience: {
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
    languages: {
      type: 'many-to-many',
      target: 'Language',
      joinTable: true,
    },
    specialInterest: {
      type: 'many-to-many',
      target: 'SpecialInterest',
      joinTable: true,
    },
    products: {
      type: 'one-to-many',
      target: 'Product',
      inverseSide: 'user',
    },
    reviews: {
      type: 'one-to-many',
      target: 'Review',
      inverseSide: 'user',
    },
  },
});

module.exports = User;
