const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({ include: [Category, Tag]})
         .then(function (result) {
          res.json(result);
         })
         .catch(function () {
           res.status(500).send("Something went wrong");
         });
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findByPk(req.params.id, { include: [Category, Tag]}).then(function (product) {
    if(product)
      res.json(product);
    else
      res.status(404).send('Product ' + req.params.id + ' not found');
  }).catch(function () {
    res.status(500).send("Something went wrong");
  });
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
      return Promise.all([
        ProductTag.destroy({ where: { product_id:  req.params.id } }),
        ProductTag.bulkCreate(productTagIdArr)]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  const product_id = req.params.id;
  Product.findByPk(product_id, { include: [Category, Tag]}).then(function (product) {
    if(product) {
      Promise.all([
        ProductTag.destroy({ where: { product_id:  product_id } }),
        product.destroy()
      ]).then(function (v) {
        res.sendStatus(200);
      }).catch(function (error) {
        console.error(error);
        res.status(500).send("Error while deleting product " + product_id + "\n" + error);
      });
    } else
      res.status(404).send('Product ' + product_id + ' not found');
  }).catch(function () {
    res.status(500).send("Something went wrong");
  });
});

module.exports = router;
