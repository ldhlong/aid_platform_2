import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const HomePage = () => {
  // Dummy data for completedRequestsCount
  const completedRequestsCount = 0;

  // Convert the completedRequestsCount to an array of digits
  const countDigits = completedRequestsCount.toString().split('');

  return (
    <Container className="text-center mt-5">
      <h1 className="display-1 fw-bold">Small Acts, Big Impact</h1>
      <div className="d-flex justify-content-center align-items-center mt-4">
        {countDigits.map((digit, index) => (
          <div key={index} className="bg-primary text-white d-inline-flex align-items-center justify-content-center rounded-square fs-1 me-1" style={{ width: '80px', height: '80px' }}>
            {digit}
          </div>
        ))}
      </div>
      <p className="fs-4 mt-4">Help Requests Completed</p>
      <p className="fs-4"><Link to="/signup">Sign Up Today!</Link></p>
    </Container>
  );
}

export default HomePage;
