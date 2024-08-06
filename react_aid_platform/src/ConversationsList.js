import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Button } from 'react-bootstrap';

function ConversationsList() {
  const { auth } = useContext(AuthContext);
  const { user } = auth;
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      if (user) {
        console.log('Fetching conversations for user:', user);
        try {
          const response = await fetch(`http://localhost:4000/conversations?user_id=${user.user_id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch conversations: ${response.statusText}`);
          }
          const data = await response.json();
          console.log('Conversations data:', data);
          setConversations(data);
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      } else {
        console.log('User not available');
      }
    };

    fetchConversations();
  }, [user]);

  const handleConversationSelect = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  const markHelpRequestComplete = async (helpRequestId) => {
    try {
      const response = await fetch(`http://localhost:4000/help_requests/${helpRequestId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completion_status: true,
          visible: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to mark help request as complete: ${response.statusText}`);
      }

      const updatedConversations = conversations.map((conversation) =>
        conversation.help_request_id === helpRequestId
          ? { ...conversation, completion_status: true }
          : conversation
      );
      setConversations(updatedConversations);
      console.log('Help request marked as complete');
    } catch (error) {
      console.error('Error marking help request as complete:', error);
    }
  };

  const republishHelpRequest = async (helpRequestId) => {
    try {
      const response = await fetch(`http://localhost:4000/help_requests/${helpRequestId}/republish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to republish help request: ${response.statusText}`);
      }

      console.log('Help request republished');
    } catch (error) {
      console.error('Error republishing help request:', error);
    }
  };

  const canRepublish = (createdAt) => {
    const createdTime = new Date(createdAt).getTime();
    const now = Date.now();
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
    return (now - createdTime) >= twentyFourHoursInMilliseconds;
  };

  return (
    <div className="conversationsList">
      <h2>Conversations</h2>
      <ul>
        {Array.isArray(conversations) && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <li
              key={conversation.id}
              onClick={() => !conversation.completion_status && handleConversationSelect(conversation.id)}
              style={{ pointerEvents: conversation.completion_status ? 'none' : 'auto', opacity: conversation.completion_status ? 0.5 : 1 }}
            >
              <div>
                <p>Conversation with: {conversation.sender_id === user.user_id ? conversation.user_id : conversation.sender_id}</p>
                <p>Last Message: {conversation.last_message}</p>
                <p>Sent at: {new Date(conversation.updated_at).toLocaleString()}</p>
                <p>Help Request ID: {conversation.help_request_id}</p>
                {canRepublish(conversation.created_at) && (
                  <Button onClick={(e) => {
                    e.stopPropagation();
                    republishHelpRequest(conversation.help_request_id);
                  }}>Republish</Button>
                )}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    markHelpRequestComplete(conversation.help_request_id);
                  }}
                  disabled={conversation.completion_status}
                  variant={conversation.completion_status ? 'secondary' : 'primary'}
                >
                  {conversation.completion_status ? 'Completed' : 'Mark as Complete'}
                </Button>
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
