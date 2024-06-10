import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Login from './Login';
import SignUp from './SignUp';
import Requests from './SubmitRequest';
import MyNavbar from './MyNavbar';
import MapComponent from './MapComponent';
import AboutPage from './AboutPage';
import Logout from './Logout';
import { AuthProvider } from './context/AuthContext'; // Ensure AuthProvider is imported

function App() {
  return (
    <AuthProvider> {/* Wrap the Router with AuthProvider */}
      <Router>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/submit_request" element={<Requests />} />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
