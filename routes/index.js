const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

/* homeController.(home | create | insert) = callback function to handle the request for url "/" */

router.get('/', homeController.home);

router.use('/users', require('./users'));
router.use('/posts', require('./posts'));

module.exports = router;