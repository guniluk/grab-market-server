
module.exports = function (sequelize, DataType) {
  const product = sequelize.define('Product', {
    name: {
      type: DataType.STRING(20),
      allowNull: false
    },
    price: {
      type: DataType.INTEGER(10),
      allowNull: false
    },
    seller: {
      type: DataType.STRING(30),
      allowNull: false
    },
    description: {
      type: DataType.STRING(300),
      allowNull: false
    },
    imageUrl: {
      type: DataType.STRING(300),
      allowNull: true
    },
    soldout: {
      type: DataType.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    }
  });
  return product;

};
