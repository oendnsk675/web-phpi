const { EntitySchema } = require('typeorm');

const SpecialInterest = new EntitySchema({
  name: 'SpecialInterest',
  tableName: 'specialInterest',
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
    users: {
      type: 'many-to-many',
      target: 'User',
      joinTable: true,
    },
  },
});

module.exports = SpecialInterest;
