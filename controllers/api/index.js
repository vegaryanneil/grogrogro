const router = require('express').Router();
const userRoutes = require('./userRoutes');
const listRoutes = require('./listRoutes');

router.use('/users', userRoutes);
<<<<<<< HEAD
router.use('/lists', listRoutes);
=======
router.use('/list', listRoutes);
>>>>>>> bebc77706c16087e5921bf5c645a00d1b28a0a38

module.exports = router;
