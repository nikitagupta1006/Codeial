const express = require('express');
const router = express.Router();
const userApiController = require('../../../controllers/api/v1/users_api');

router.post('/create-session', userApiController.createSession);
module.exports = router;