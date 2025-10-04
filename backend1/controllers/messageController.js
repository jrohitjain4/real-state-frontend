const { Message, User, Property } = require('../models');

// Helper function to generate conversation ID
const generateConversationId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('-');
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, propertyId, subject, message } = req.body;
    const senderId = req.user.id;

    console.log('=== MESSAGE DEBUG ===');
    console.log('Sender ID (from token):', senderId);
    console.log('Receiver ID (from body):', receiverId);
    console.log('Property ID:', propertyId);
    console.log('Message:', message);

    // Validate required fields
    if (!receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and message are required'
      });
    }

    // Check if receiver exists
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Check if property exists (if provided)
    if (propertyId) {
      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }
    }

    // Generate conversation ID
    const conversationId = generateConversationId(senderId, receiverId);

    // Create message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      propertyId: propertyId || null,
      subject: subject || null,
      message,
      conversationId
    });

    // Fetch the created message with associations
    const messageWithDetails = await Message.findByPk(newMessage.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'price', 'address']
        }
      ]
    });

    // Emit WebSocket event for real-time messaging to BOTH sender and receiver
    const io = req.app.get('io');
    if (io) {
      const messageData = {
        id: messageWithDetails.id,
        message: messageWithDetails.message,
        senderId: messageWithDetails.senderId,
        receiverId: messageWithDetails.receiverId,
        propertyId: messageWithDetails.propertyId,
        subject: messageWithDetails.subject,
        createdAt: messageWithDetails.createdAt,
        sender: messageWithDetails.sender
      };
      
      // Emit to receiver
      io.to(`user-${receiverId}`).emit('message-received', messageData);
      console.log(`📤 Message emitted to receiver: user-${receiverId}`);
      
      // Emit to sender (so they can see their own message)
      io.to(`user-${senderId}`).emit('message-received', messageData);
      console.log(`📤 Message emitted to sender: user-${senderId}`);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: messageWithDetails
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get messages for a user (inbox)
const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, conversationId } = req.query;

    let whereClause;

    // If conversationId is provided, get messages for that conversation
    if (conversationId) {
      // For conversation messages, get both sent and received messages
      whereClause = {
        [require('sequelize').Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ],
        conversationId: conversationId
      };
    } else {
      // For inbox, only show received messages
      whereClause = {
        receiverId: userId
      };
    }

    const offset = (page - 1) * limit;

    console.log('=== GET MESSAGES DEBUG ===');
    console.log('User ID:', userId);
    console.log('Conversation ID:', conversationId);
    console.log('Where clause:', whereClause);

    const messages = await Message.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'price', 'address']
        }
      ],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    console.log('Found messages count:', messages.count);
    messages.rows.forEach(msg => {
      console.log(`Message ${msg.id}: Sender ${msg.senderId} -> Receiver ${msg.receiverId}, ConvID: ${msg.conversationId}`);
    });

    res.json({
      success: true,
      data: {
        messages: messages.rows,
        total: messages.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(messages.count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get conversations for a user
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('=== GET CONVERSATIONS DEBUG ===');
    console.log('Current user ID:', userId);

    // Get all unique conversations for the user
    const conversations = await Message.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'price', 'address']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Group messages by conversation
    const conversationMap = new Map();

    console.log('Found conversations count:', conversations.length);
    conversations.forEach(message => {
      const conversationId = message.conversationId;
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser = message.senderId === userId ? message.receiver : message.sender;
      
      // Skip self-messages (where sender and receiver are the same)
      if (message.senderId === message.receiverId) {
        console.log('Skipping self-message:', message.id);
        return;
      }
      
      console.log('Message ID:', message.id, 'Sender:', message.senderId, 'Receiver:', message.receiverId, 'Other User:', otherUserId);
      console.log('Sender User:', message.sender ? `${message.sender.firstName} ${message.sender.lastName}` : 'No sender data');
      console.log('Receiver User:', message.receiver ? `${message.receiver.firstName} ${message.receiver.lastName}` : 'No receiver data');
      console.log('Other User Data:', otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'No other user data');

      if (!conversationMap.has(conversationId)) {
        conversationMap.set(conversationId, {
          conversationId,
          otherUser,
          lastMessage: message,
          unreadCount: 0,
          messages: []
        });
      }

      const conversation = conversationMap.get(conversationId);
      conversation.messages.push(message);

      // Count unread messages
      if (message.receiverId === userId && !message.isRead) {
        conversation.unreadCount++;
      }
    });

    // Convert map to array and sort by last message time
    const conversationList = Array.from(conversationMap.values()).sort((a, b) => 
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );

    res.json({
      success: true,
      data: conversationList
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      where: {
        id: messageId,
        receiverId: userId
      }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.update({
      isRead: true,
      readAt: new Date()
    });

    res.json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Mark all messages in conversation as read
const markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await Message.update(
      {
        isRead: true,
        readAt: new Date()
      },
      {
        where: {
          conversationId,
          receiverId: userId,
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      message: 'All messages in conversation marked as read'
    });

  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.count({
      where: {
        receiverId: userId,
        isRead: false
      }
    });

    res.json({
      success: true,
      data: {
        unreadCount
      }
    });

  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Debug endpoint to check user info
const debugUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    
    res.json({
      success: true,
      data: {
        currentUser: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('Error in debug user info:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Debug endpoint to check property data
const debugPropertyInfo = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findByPk(propertyId, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        property: {
          id: property.id,
          title: property.title,
          userId: property.userId,
          owner: property.owner
        }
      }
    });
  } catch (error) {
    console.error('Error in debug property info:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead,
  markConversationAsRead,
  getUnreadCount,
  debugUserInfo,
  debugPropertyInfo
};
