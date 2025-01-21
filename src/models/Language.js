const { EntitySchema } = require('typeorm');

const Language = new EntitySchema({
  name: 'Language',
  tableName: 'languages',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    language: {
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

module.exports = Language;
