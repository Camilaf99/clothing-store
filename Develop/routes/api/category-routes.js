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
    if(category)
      res.json(category);
    else
      res.status(404).send('Category ' + req.params.id + ' not found');
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
  /*
  {
    categoryName: ""
  }
  */
  const category = req.params.id;
  const { categoryName } = req.body;
  if(categoryName) {
    Category.findByPk(category).then(function (category) {
      if(category) {
        category.category_name = categoryName;
        category.save().then(function (v) {
          res.sendStatus(200);
        }).catch(function (error) {
          res.status(500).send('Error while trying to save category: ' + req.params.id + ' with values: ' + categoryName + "\n" + error);
        });
      } else {
        res.status(404).send('Error while trying to retrieve category: ' + req.params.id + "\n" + error);
      }
    }).catch(function (error) {
      res.status(404).send('Error while trying to retrieve category: ' + req.params.id + "\n" + error);
    });
  } else {
    res.status(400).send('Must provide categoryName to update');
  }
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  const categoryId = req.params.id;
  Category.findByPk(categoryId).then(function (category) {
    if(category) {
      category.destroy().then(function (v) {
        // Category was deleted
        res.sendStatus(200);
      }).catch(function (error) {
        // Something went wrong
        res.send(500).send("Something went wrong when trying to delete Category with id " + categoryId + "\n" + error);
      });
    } else {
      // Category not found
      res.status(404).send('Error while trying to retrieve category: ' + req.params.id + "\n" + error);
    }
  }).catch(function () {
    res.status(404).send('Error while trying to retrieve category: ' + req.params.id);
  });
});

module.exports = router;
