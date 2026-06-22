const express = require('express');
const { getMessages, sendMessage, getChatUsers, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);


router.get('/conversations', getConversations); 

router.get('/users', getChatUsers);
router.get('/:userId', getMessages);
router.post('/', sendMessage);

module.exports = router;