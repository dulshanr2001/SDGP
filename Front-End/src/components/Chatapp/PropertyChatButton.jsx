import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiService from '../../services/api-service';
import { toast } from 'react-toastify';
import { useLoaderStore } from '../../store/use-loader-store';

const PropertyChatButton = ({ propertyId, landlordId, studentId }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loader = useLoaderStore();

  const startChat = async () => {
    if (!studentId) {
      navigate('/login?redirect=property/' + propertyId);
      return;
    }

    try {
      setLoading(true);
      loader.setLoading(true);
      const response = await apiService.post('/chats/start', {
        studentId,
        landlordId,
        propertyId
      });
      
      // Navigate to the chat
      navigate(`/chats/${response.data.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start conversation. Please try again.');
    }finally{
      loader.setLoading(false);
      setLoading(false);
    }
  };

  return (
    <button 
      className="msg-btn"
      onClick={startChat}
      disabled={loading}
    >
      {loading ? 'Loading...' : 'Message Landlord'}
    </button>
  );
};

export default PropertyChatButton;