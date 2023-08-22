const express = require('express')
const router = express.Router();
const voteController = require('../controllers/voteController');

// Define routes
router.post('/getvotes', voteController.getVotes);
router.post('/createvote', voteController.createVote);

module.exports = router;