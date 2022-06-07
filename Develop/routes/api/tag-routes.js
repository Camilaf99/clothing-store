const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({include: Product})
     .then(function (result) {
      res.json(result);
     })
     .catch(function () {
      res.sendStatus(500);
     });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findByPk(req.params.id, { include: Product}).then(function (tag) {
    if(tag)
      res.json(tag);
    else
      res.status(404).send('Tag ' + req.params.id + ' not found');
  }).catch(function () {
    res.status(500).send("Something went wrong");
  });
});

router.post('/', (req, res) => {
  // create a new tag
  const { tagName } = req.body;
    Tag.create({ tag_name: tagName }).then(function (newTag) {
      res.location('/api/tags/' + newTag.id);
      res.sendStatus(201);  
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  const { tagName } = req.body;
  if(tagName) {
    Tag.findByPk(req.params.id, { include: Product}).then(function (tag) {
      if(tag) {
        tag.tag_name = tagName;
        tag.save()
           .then(function (v) {
            res.sendStatus(200);
           }).catch(function (error) {
            console.error(error);
            res.sendStatus(500);
           });
      }
      else
        res.status(404).send('Tag ' + req.params.id + ' not found');
    }).catch(function () {
      res.status(500).send("Something went wrong");
    });  
  } else {
    res.status(400).send("Please provide a tagName");
  }
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  const tag_id = req.params.id;
  Tag.findByPk(tag_id, { include: Product}).then(function (tag) {
    if(tag) {
      Promise.all([
        ProductTag.destroy({ where: { tag_id: tag_id } }),
        tag.destroy()
      ]).then(function (v) {
        res.sendStatus(200);
      }).catch(function (error) {
        console.error(error);
        res.status(500).send("Error while deleting tag " + tag_id + "\n" + error);
      });
    } else
      res.status(404).send('Tag ' + tag_id + ' not found');
  }).catch(function () {
    res.status(500).send("Something went wrong");
  });
});

module.exports = router;
