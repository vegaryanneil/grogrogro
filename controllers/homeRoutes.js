const router = require('express').Router();
const { List, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  //console.log(req.session.loggedIn)
  try {
    res.render('homepage'); //res.render('homepage', {loggedIn: req.session.logged_in});
  } catch (err) {
    res.status(500).json(err);
  }
});

// About Route
router.get('/about', async (req, res) => {
  try {
    res.render('about');
  } catch (err) {
    res.status(500).json(err);
  }
});
// Contact Route
router.get('/contact', async (req, res) => {
  try {
    res.render('contact');
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      // include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true, // loggedIn: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/create/:id', async (req, res) => {
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
        loggedIn: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/testing', async (req, res) => {
  try {
    // Get all list and JOIN with user data
    const listData = await List.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    // Serialize data so the template can read it
    const lists = listData.map((list) => list.get({ plain: true }));
    console.log('This is a lgo');
    // Pass serialized data and session flag into template
    res.render('testing');
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for logging user out
router.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
