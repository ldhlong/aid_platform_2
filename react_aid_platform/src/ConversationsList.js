import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

function ConversationsList() {
  const { auth } = useContext(AuthContext);
  const { user } = auth; // Destructure user from auth context
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      if (user) { // Check if user exists
        console.log('Fetching conversations for user:', user); // Debugging log
        try {
          const response = await fetch(`http://localhost:4000/conversations?user_id=${user.user_id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch conversations: ${response.statusText}`);
          }
          const data = await response.json();
          console.log('Conversations data:', data); // Debugging log
          setConversations(data);
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      } else {
        console.log('User not available'); // Debugging log
      }
    };

    fetchConversations();
  }, [user]); // Ensure `user` is a dependency

  const handleConversationSelect = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  return (
    <div className="conversationsList">
      <h2>Conversations</h2>
      <ul>
        {Array.isArray(conversations) && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <li key={conversation.id} onClick={() => handleConversationSelect(conversation.id)}>
              <div>
                <p>Conversation with: {conversation.sender_id === user.user_id ? conversation.user_id : conversation.sender_id}</p>
                <p>Last Message: {conversation.last_message}</p>
                <p>Sent at: {new Date(conversation.updated_at).toLocaleString()}</p>
              </div>
            </li>
          ))
        ) : (
          <li>No conversations found.</li>
        )}
      </ul>
    </div>
  );
}

export default ConversationsList;
