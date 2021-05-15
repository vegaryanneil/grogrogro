const User = require('./User');
const List = require('./List');
const Item = require('./item');

User.hasMany(List, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

List.belongsTo(User, {
  foreignKey: 'user_id',
});

Item.belongsTo(List, {
  foreignKey: 'user_id',
});

module.exports = { User, List, Item };
