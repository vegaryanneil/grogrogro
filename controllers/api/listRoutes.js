const router = require('express').Router();
const { List } = require('../../models');
const withAuth = require('../../utils/auth');

// router.get('/create', async (req, res) => {
//   try {
//     const list = {
//       name:"fakename"
//     }
//     res.render('create', {list});
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/create', async (req, res) => {
  try {
    const listData = await List.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const list = listData.get({ plain: true });

    res.render('create', 
      {list,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/create', withAuth, async (req, res) => {
  // /api/lists
  console.log('req.body', req.body);

  try {
    const newList = await List.create({
    name: req.body.name,
      user_id: req.session.user_id,
    });

    res.status(200).json(newList);
  } catch (err) {
    console.log('ERROR!', err);
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  try { 
    const listData = await List.create({
    name: req.body.name,
  });
  res.status(200).json(listData)
} catch (err) {
  res.status(400).json(err);
}
});

// According to MVC, what is the role of this action method?
// This action method is the Controller. It accepts input and sends data to the Model and the View.
router.put('/list', async (req, res) => {
  // Where is this action method sending the data from the body of the fetch request? Why?
  // It is sending the data to the Model so that one dish can be updated with new data in the database.
  try {
    const list = await List.update(
    {
      name: req.body.name,
    },
    {
      where: {
        id: req.params.id,
      },
    });
    // If the database is updated successfully, what happens to the updated data below?
    // The updated data (dish) is then sent back to handler that dispatched the fetch request.
    res.status(200).json(list);
  } catch (err) {
      res.status(500).json(err);
    };
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
      res.status(404).json({ message: 'No list found with this id!' });
      return;
    }

    res.status(200).json(listData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
