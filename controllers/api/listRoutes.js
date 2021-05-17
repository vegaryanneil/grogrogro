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

router.get('/create', async (req, res) => {  // '/create/:id'
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
    {list,  // ...list
    logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/create', withAuth, async (req, res) => {
  console.log('req.body', req.body);

  try {
    const newList = await List.create({
      // ...req.body,
      name: req.body.name, //this is a new line
      user_id: req.session.user_id,
    });
    console.log(newList);
    res.status(200).json(JSON.stringify(newList)); //res.status(200).json(newList);
  } catch (err) {
    console.log('ERROR!', err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // This is sending the data to the Model so that one dish can be updated with new data in the database.
  try {
    const list = await List.update(
      {
        name: req.body.list_name,  //.list_name
        user_id: req.session.user_id,
      },
      {
        where: {
          id: req.params.id,
        },
      });
    
    // The updated data (list) is then sent back to handler that dispatched the fetch request.
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
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
      res.status(404).json({ message: 'No list found with this id!' });
      return;
    }

    res.status(200).json(listData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
