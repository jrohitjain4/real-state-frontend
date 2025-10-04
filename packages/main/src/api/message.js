const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Send a message
export const sendMessage = async (messageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(messageData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message');
    }

    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get messages (inbox)
export const getMessages = async (page = 1, limit = 20, conversationId = null) => {
  try {
    let url = `${API_BASE_URL}/messages?page=${page}&limit=${limit}`;
    if (conversationId) {
      url += `&conversationId=${conversationId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch messages');
    }

    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Get conversations
export const getConversations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch conversations');
    }

    return data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark message as read');
    }

    return data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

// Mark conversation as read
export const markConversationAsRead = async (conversationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/conversation/${conversationId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark conversation as read');
    }

    return data;
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    throw error;
  }
};

// Get unread message count
export const getUnreadCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/unread-count`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch unread count');
    }

    return data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};
