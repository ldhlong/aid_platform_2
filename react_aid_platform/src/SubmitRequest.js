import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const SubmitRequest = ({ token }) => {
  const [title, setTitle] = useState('');
  const [requestType, setRequestType] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id); // Use the 'id' field from user data
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      request: {
        id: userId, // Include the user ID in the request data
        title,
        request_type: requestType,
        description,
        latitude,
        longitude,
      },
    };

    try {
      const response = await fetch('http://localhost:4000/submit_request', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the authentication token in the Authorization header
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors.join(', ') || 'Request submission failed');
      }

      // Set success message
      setMessage('Request submitted successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Request Submission Error:', error);
      // Set error message
      setMessage(error.message || 'Request submission failed');
      setMessageType('error');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="title">
        <Form.Label>Title:</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
      </Form.Group>
      <Form.Group controlId="requestType">
        <Form.Label>Type of Request:</Form.Label>
        <Form.Select
          value={requestType}
          onChange={(e) => setRequestType(e.target.value)}
          required
        >
          <option value="">Select Type</option>
          <option value="one-time-task">One Time Task</option>
          <option value="material-need">Material Need</option>
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="description">
        <Form.Label>Description:</Form.Label>
        <Form.Control
          as="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          maxLength={300}
          required
        />
      </Form.Group>
      <Form.Group controlId="latitude">
        <Form.Label>Latitude:</Form.Label>
        <Form.Control
          type="text"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Latitude"
          required
        />
      </Form.Group>
      <Form.Group controlId="longitude">
        <Form.Label>Longitude:</Form.Label>
        <Form.Control
          type="text"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Longitude"
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">Submit Request</Button>

      {message && (
        <div style={{ color: messageType === 'success' ? 'green' : 'red' }}>
          {message}
        </div>
      )}
    </Form>
  );
};

export default SubmitRequest;
