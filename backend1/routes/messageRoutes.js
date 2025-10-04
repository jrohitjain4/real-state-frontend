const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Send a message
router.post('/send', messageController.sendMessage);

// Get messages (inbox)
router.get('/', messageController.getMessages);

// Get conversations
router.get('/conversations', messageController.getConversations);

// Get messages for a specific conversation
router.get('/conversation/:conversationId', messageController.getMessages);

// Mark message as read
router.put('/:messageId/read', messageController.markAsRead);

// Mark all messages in conversation as read
router.put('/conversation/:conversationId/read', messageController.markConversationAsRead);

// Get unread message count
router.get('/unread-count', messageController.getUnreadCount);

// Debug endpoint
router.get('/debug-user', messageController.debugUserInfo);
router.get('/debug-property/:propertyId', messageController.debugPropertyInfo);

module.exports = router;
