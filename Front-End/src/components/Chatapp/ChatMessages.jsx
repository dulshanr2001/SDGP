import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChatMessages = ({ userId, userType }) => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatDetails, setChatDetails] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/chats/${chatId}`);
        setChatDetails(response.data);
        
        // Determine the other participant's ID to fetch their details
        const otherUserId = userType === 'STUDENT' 
          ? response.data.landlordId 
          : response.data.studentId;
        
        const userResponse = await axios.get(`http://localhost:8080/api/users/${otherUserId}`);
        const propertyResponse = await axios.get(`http://localhost:8080/api/properties/${response.data.propertyId}`);
        
        setChatDetails(prev => ({
          ...prev,
          participant: userResponse.data,
          property: propertyResponse.data
        }));
      } catch (err) {
        setError('Failed to load chat details');
        console.error('Error fetching chat details:', err);
        toast.error('Failed to load chat details');
      }
    };

    fetchChatDetails();
  }, [chatId, userType]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/chats/${chatId}/messages`);
        if(response.data) {
          setMessages(response.data);
        }
        setLoading(false);
        
        // Mark messages as read
        await axios.post(`http://localhost:8080/api/chats/${chatId}/read`, { userId });
      } catch (err) {
        setError('Failed to load messages');
        setLoading(false);
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    
    // Poll for new messages every 5 seconds
    const intervalId = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(intervalId);
  }, [chatId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      await axios.post(`http://localhost:8080/api/chats/${chatId}/messages`, {
        senderId: userId,
        senderType: userType,
        content: newMessage.trim()
      });
      
      setNewMessage('');
      
      // Fetch the updated messages
      const response = await axios.get(`http://localhost:8080/api/chats/${chatId}/messages`);
      setMessages(response.data);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString([], { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const goBack = () => {
    navigate('/chats');
  };

  if (loading && !chatDetails) return (
    <div className="flex items-center justify-center h-full p-4 text-gray-500">Loading conversation...</div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-full p-4 text-red-500">{error}</div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-3 border-b border-gray-200 bg-white shadow-sm">
        <button 
          className="mr-2 p-1 rounded-full hover:bg-gray-100 md:hidden" 
          onClick={goBack}
        >
          <span className="text-xl">←</span>
        </button>
        {chatDetails && (
          <div className="overflow-hidden">
            <h3 className="font-semibold text-lg truncate">
              {chatDetails.participant?.firstName} {chatDetails.participant?.lastName}
            </h3>
            <p className="text-sm text-gray-600 truncate">{chatDetails.property?.title}</p>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {!messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500 mb-1">No messages yet</p>
            <p className="text-sm text-gray-400">Send the first message to start a conversation</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex mb-4 ${message.senderType === userType ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] p-3 rounded-lg shadow-sm
                  ${message.senderType === userType 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none'}
                `}>
                  <p className="mb-1">{message.content}</p>
                  <span className={`text-xs ${message.senderType === userType ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <form 
        className="p-3 border-t border-gray-200 bg-white flex items-center" 
        onSubmit={sendMessage}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button 
          type="submit" 
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatMessages;