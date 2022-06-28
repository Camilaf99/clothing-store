const { Model, DataTypes } = require('sequelize');
const { Product } = require("./Product");
const { Tag } = require("./Tag");

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    product_id: {
       type: DataTypes.INTEGER,
       primaryKey: true
    },
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
    schema: 'ecommerce_db'
  }
);

module.exports = ProductTag;
