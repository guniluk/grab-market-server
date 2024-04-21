
module.exports = function (sequelize, DataType) {
  const banner = sequelize.define('Banner', {
    imageUrl: {
      type: DataType.STRING(300),
      allowNull: false
    },
    href: {
      type: DataType.STRING(200),
      allowNull: false
    },

  });
  return banner;
};

