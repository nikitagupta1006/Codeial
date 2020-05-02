const express = require('express');
const router = express.Router();
/* homeController.(home | create | insert) = callback function to handle the request for url "/" */

// router.get('/', homeController.home);
router.use('/posts', require('./posts'));
router.use('/users', require('./users'));
router.use('/comments', require('./comments'));
router.use('/api', require('./api/index'));

module.exports = router;