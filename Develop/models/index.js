// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

ProductTag.belongsTo(Tag);
ProductTag.belongsTo(Product);

// Products belongsTo Category
Product.belongsTo(Category);

// Categories have many Products
Category.hasMany(Product);

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, { through: ProductTag });
Product.hasMany(ProductTag);

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, { through: ProductTag });
Tag.hasMany(ProductTag);

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
