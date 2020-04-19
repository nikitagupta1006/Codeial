const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

/* homeController.(home | create | insert) = callback function to handle the request for url "/" */

router.get('/', homeController.home);
router.get('/create', homeController.create);
router.post('/insert', homeController.insert);

router.use('/user', require('./users'));
router.use('/post', require('./posts'));

module.exports = router;