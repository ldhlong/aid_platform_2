import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const ws = new WebSocket("ws://localhost:4000/cable");

function MessagesPage() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [guid, setGuid] = useState("");
  const [messagesContainer, setMessagesContainer] = useState(null);

  useEffect(() => {
    setMessagesContainer(document.getElementById("messages"));
  }, []);

  const resetScroll = useCallback((data) => {
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messagesContainer]);

  const setMessagesAndScrollDown = useCallback((data) => {
    setMessages(data);
    resetScroll(data);
  }, [resetScroll]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:4000/messages?conversation_id=${conversationId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const text = await response.text(); // Get response body as text
      console.log("Response text:", text); // Log response text for debugging
      
      if (!text) {
        throw new Error("Empty response received");
      }
      
      const data = JSON.parse(text); // Parse text as JSON
      console.log("Parsed data:", data); // Log parsed data for debugging
      
      setMessagesAndScrollDown(data); // Ensure this updates messages state correctly
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [conversationId, setMessagesAndScrollDown]);

  useEffect(() => {
    ws.onopen = () => {
      console.log("Connected to websocket server");
      const newGuid = Math.random().toString(36).substring(2, 15);
      setGuid(newGuid);

      ws.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({
            id: newGuid,
            conversation_id: conversationId,
            channel: "MessagesChannel",
          }),
        })
      );
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("WebSocket message received:", data); // Log incoming WebSocket messages for debugging
      if (["ping", "welcome", "confirm_subscription"].includes(data.type)) return;

      const message = data.message;
      console.log("Parsed message:", message); // Log parsed message for debugging
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        resetScroll(newMessages);
        return newMessages;
      });
    };

    return () => {
      ws.close();
    };
  }, [conversationId, resetScroll]);

  useEffect(() => {
    fetchMessages();
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    resetScroll(messages);
  }, [messages, messagesContainer, resetScroll]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = e.target.message.value;
    e.target.message.value = "";
    const user_id = localStorage.getItem("user_id");
    const conversation_id = conversationId; // Ensure conversationId is correctly set
    const response = await fetch(`http://localhost:4000/help_requests/${conversationId}`);
    const helpRequestData = await response.json();
    const receiver_id = helpRequestData.user_id; // Get receiver_id (user_id from help_requests)

    await fetch("http://localhost:4000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body,
        conversation_id,
        sender_id: user_id, // Adjust based on how sender_id should be handled
        receiver_id, // Include receiver_id in the request
      }),
    });
  };

  return (
    <div className="App">
      <div className="messageHeader">
        <h1>Messages</h1>
        <p>Guid: {guid}</p>
      </div>
      <div className="messages" id="messages">
        {messages.map((message) => (
          <div className="message" key={message.id}>
            <p>{message.body}</p>
          </div>
        ))}
      </div>
      <div className="messageForm">
        <form onSubmit={handleSubmit}>
          <input className="messageInput" type="text" name="message" />
          <button className="messageButton" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessagesPage;
