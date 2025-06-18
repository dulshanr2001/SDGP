import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
// import { UserContext } from '../../context/UserContext';
import ChatMessages from './ChatMessages';
import ChatList from './ChatList';
import useAuthStore from '../../store/auth-store';

const ChatPage = () => {
  const { chatId } = useParams();
  const authStore = useAuthStore();
  const user = authStore.user;
  // const { user } = useContext(UserContext);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <h2 className="text-xl font-semibold text-gray-700">Please log in to view your messages</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`flex h-[calc(100vh-64px)] ${chatId ? 'md:flex' : 'flex'}`}>
        <div className={`w-full md:w-1/3 border-r border-gray-200 ${chatId ? 'hidden md:block' : 'block'}`}>
          <ChatList 
            userType={user.userType} 
            userId={user.id} 
          />
        </div>
        
        {chatId && (
          <div className="w-full md:w-2/3">
            <ChatMessages 
            userType={user.userType} 
            userId={user.id} 
            />
          </div>
        )}
        
        {!chatId && (
          <div className="hidden md:flex md:w-2/3 items-center justify-center">
            <div className="text-center p-8">
              <div className="text-5xl mb-4">✉</div>
              <h2 className="text-2xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-gray-600">Choose a conversation from the list or start a new one by browsing properties.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;