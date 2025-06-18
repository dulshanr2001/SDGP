import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UnreadMessagesIndicator = ({ userId }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!userId) return;
      
      try {
        const response = await axios.get(`http://localhost:8080/api/chats/unread/user/${userId}`);
        setUnreadCount(response.data.totalUnreadCount);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    
    // Poll for new messages every 30 seconds
    const intervalId = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(intervalId);
  }, [userId]);

  const handleClick = () => {
    navigate('/chats');
  };

  return (
    <button 
      className="relative p-2 text-gray-700 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300" 
      onClick={handleClick}
    >
      <span className="text-xl">✉</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default UnreadMessagesIndicator;