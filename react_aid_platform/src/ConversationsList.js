// ConversationsList.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

function ConversationsList() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch("http://localhost:4000/messages");
      const data = await response.json();
      console.log("Fetched conversations:", data); // Debugging log
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleConversationSelect = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  return (
    <div className="conversationsList">
      <h2>Conversations</h2>
      <ul>
        {Array.isArray(conversations) && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <li key={conversation.conversation_id} onClick={() => handleConversationSelect(conversation.conversation_id)}>
              {conversation.user_id === user.id ? conversation.sender_id : conversation.user_id}
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
