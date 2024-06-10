import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SubmitRequest = () => {
  const [title, setTitle] = useState('');
  const [requestType, setRequestType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      request: {
        title,
        request_type: requestType,
        description,
        location,
      },
    };

    try {
      const response = await fetch('http://localhost:3000/submit_request', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request submission failed');
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
      <Form.Group controlId="location">
        <Form.Label>Location:</Form.Label>
        <Form.Control
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
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
