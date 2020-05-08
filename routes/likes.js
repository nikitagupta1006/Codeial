const express = require('express');
const router = express.Router();
const passport = require('passport');
const LikesController = require('../controllers/likes_controller');

router.get('/', LikesController.getLikes);
router.post('/toggle', passport.checkAuthentication, LikesController.toggleLike);

module.exports = router;