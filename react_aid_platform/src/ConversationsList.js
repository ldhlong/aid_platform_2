import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Button } from 'react-bootstrap';

function ConversationsList() {
  const { auth } = useContext(AuthContext);
  const { user } = auth;
  const [conversations, setConversations] = useState([]);
  const [assignedUserCount, setAssignedUserCount] = useState({});
  const navigate = useNavigate();

  const fetchConversations = async () => {
    if (user) {
      try {
        const response = await fetch(`http://localhost:4000/conversations?user_id=${user.user_id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch conversations: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched conversations:', data); // Add logging here
        setConversations(data);

        // Count assigned users for each help request
        const counts = {};
        data.forEach(conversation => {
          if (!counts[conversation.help_request_id]) {
            counts[conversation.help_request_id] = 0;
          }
          counts[conversation.help_request_id]++;
        });
        setAssignedUserCount(counts);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    }
  };

  useEffect(() => {
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
        body: JSON.stringify({ completion_status: true, visible: false }),
      });

      if (!response.ok) {
        throw new Error(`Failed to mark help request as complete: ${response.statusText}`);
      }

      // Refresh conversations to ensure UI is in sync with the backend
      await fetchConversations(); // Ensure fetchConversations is awaited here
    } catch (error) {
      console.error('Error marking help request as complete:', error);
    }
  };

  const republishHelpRequest = async (conversationId, helpRequestId) => {
    try {
      const response = await fetch(`http://localhost:4000/help_requests/${helpRequestId}/republish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation_id: conversationId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to republish help request: ${response.statusText}`);
      }

      // Refresh conversations to ensure UI is in sync with the backend
      await fetchConversations(); // Ensure fetchConversations is awaited here

    } catch (error) {
      console.error('Error republishing help request:', error);
    }
  };


  return (
    <div className="conversationsList">
      <h2>Conversations</h2>
      <ul>
        {Array.isArray(conversations) && conversations.length > 0 ? (
          conversations.map((conversation) => {
            const helpRequestId = conversation.help_request_id;
            const assignedCount = assignedUserCount[helpRequestId] || 0;
            const canRepublish = assignedCount >= 5;
            const isComplete = conversation.completion_status;
            const isRepublished = !conversation.visible;
            console.log(`Conversation ID: ${conversation.id}, Visible: ${conversation.visible}, Is Republished: ${isRepublished}`);

            return (
              <li
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation.id)}
              >
                <div>
                  <p>Conversation with: {conversation.sender_id === user.user_id ? conversation.user_id : conversation.sender_id}</p>
                  <p>Last Message: {conversation.last_message}</p>
                  <p>Sent at: {new Date(conversation.updated_at).toLocaleString()}</p>
                  <p>Help Request ID: {conversation.help_request_id}</p>
                  {conversation.user_id === user.user_id && (
                    <>
                      {canRepublish && !isComplete && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            republishHelpRequest(conversation.id, helpRequestId);
                          }}
                          disabled={isRepublished}
                          variant={isRepublished ? 'secondary' : 'primary'}
                        >
                          {isRepublished ? 'Republished' : 'Republish Request'}
                        </Button>
                      )}

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          markHelpRequestComplete(helpRequestId);
                        }}
                        disabled={isComplete}
                        variant={isComplete ? 'secondary' : 'primary'}
                      >
                        {isComplete ? 'Completed' : 'Mark as Complete'}
                      </Button>
                    </>
                  )}
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
