const { EntitySchema } = require('typeorm');

const UserAvailableAreas = new EntitySchema({
  name: 'UserAvailableAreas',
  tableName: 'userAvailableAreas',
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

module.exports = UserAvailableAreas;
