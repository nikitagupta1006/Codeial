const express = require('express');
const router = express.Router();
const postApiController = require('../../../controllers/api/v2/posts_api');
router.get('/', postApiController.index);

module.exports = router;