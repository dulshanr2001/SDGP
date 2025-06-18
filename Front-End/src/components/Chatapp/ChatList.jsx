import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ChatList = ({ userType, userId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { chatId } = useParams();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const endpoint = userType === 'STUDENT' 
          ? `/api/chats/student/${userId}`
          : `/api/chats/landlord/${userId}`;
        
        const response = await axios.get(`http://localhost:8080${endpoint}`);
        console.log(response);
        if(response.data) {
          setChats(response.data);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load chats. Please try again later.');
        setLoading(false);
        console.error('Error fetching chats:', err);
      }
    };

    if (userId) {
      fetchChats();
      
      // Poll for new messages every 30 seconds
      const intervalId = setInterval(fetchChats, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [userType, userId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleChatSelect = (chatId) => {
    navigate(`/chats/${chatId}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full p-4 text-gray-500">Loading chats...</div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-full p-4 text-red-500">{error}</div>
  );


  return (
    <div className="flex flex-col h-full bg-white">
      <h2 className="p-4 m-0 text-lg font-semibold border-b border-gray-200">Messages</h2>
      
      {!chats || (chats && chats.length === 0) ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <p className="text-gray-500 mb-1">No messages yet</p>
          {userType === 'student' && 
            <p className="text-sm text-gray-400">Browse properties and contact landlords to start a conversation</p>
          }
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div 
              key={chat.chat.id} 
              className={`flex p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                ${chat.unreadCount > 0 ? 'bg-blue-50' : ''}
                ${chat.chat.id === chatId ? 'bg-gray-100' : ''}
              `}
              onClick={() => handleChatSelect(chat.chat.id)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                {chat.property?.thumbnail ? (
                  <img 
                    src={chat.property.thumbnail} 
                    alt="Property" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-500 text-white text-xl font-bold">
                    {chat.participant?.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h6 className="font-mediumtruncate m-0">
                    {chat.participant?.name || 'Unknown'}
                  </h6>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">{formatTimestamp(chat.lastMessage.timestamp)}</span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 truncate m-0">{chat.property?.title || 'Property'}</p>
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-700 truncate m-0">{chat.lastMessage.content}</p>
                  )}
                </div>
              </div>
              
              {chat.unreadCount > 0 && (
                <div className="ml-2 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;