const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts_controller')

router.get('/', postsController.base);

module.exports = router;