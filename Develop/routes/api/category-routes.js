const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({ include: Product }).then(function (categories) {
    res.json(categories);
  });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  const category = Category.findByPk(req.params.id, { include: Product }).then(function (category) {
    res.json(category);
  });
});

router.post('/', (req, res) => {
  // create a new category
  /*
    {
      categoryName: ""
    }
  */
    const { categoryName } = req.body;
    Category.create({ category_name: categoryName }).then(function (newCategory) {
      res.location('/api/categories/' + newCategory.id);
      res.sendStatus(201);  
    });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
