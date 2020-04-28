const express = require('express');
const router = express.Router();
const passport = require('passport');
const postsController = require('../controllers/posts_controller');

router.get('/', postsController.home);
router.post('/create', passport.checkAuthentication, postsController.create);
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy); // check authentication
module.exports = router;