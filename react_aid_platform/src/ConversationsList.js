import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

function ConversationsList() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]); // Depend on 'user' to fetch conversations for the current user

  const fetchConversations = async () => {
    try {
      const response = await fetch(`http://localhost:4000/messages?sender_id=${user.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched conversations:", data); // Debugging log
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      // Optionally, set state to handle error state in UI
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
          conversations.map((conversation) => {
            console.log("Conversation:", conversation); // Debugging log
            return (
              <li key={conversation.conversation_id} onClick={() => handleConversationSelect(conversation.conversation_id)}>
                <div>
                  <p>Conversation with: {conversation.user_id}</p>
                  <p>Last Message: {conversation.body}</p>
                  <p>Sent at: {new Date(conversation.created_at).toLocaleString()}</p>
                </div>
              </li>
            );
          })
        ) : (
          <li>No conversations found.</li>
        )}
      </ul>
    </div>
  );
}

export default ConversationsList;