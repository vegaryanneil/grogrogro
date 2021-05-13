const router = require('express').Router();
const { List } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/create', async (req, res) => {
  try {
    const list = {
      name:"fakename"
    }
    res.render('create', {list});
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/create', withAuth, async (req, res) => {
  // /api/lists
  console.log('req.body', req.body);

  try {
    const newList = await List.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newList);
  } catch (err) {
    console.log('ERROR!', err);
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const listData = await List.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!listData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(listData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
