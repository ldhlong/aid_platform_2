import React, { useRef, useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = ({ setShow }) => {
  const formRef = useRef();
  const { setAuth } = useContext(AuthContext); // Ensure setAuth is correctly retrieved from context
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // State for success message

  const login = async (userInfo) => {
    const url = "http://localhost:4000/login";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ user: userInfo })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login error response:", errorData);
        setMessage(errorData.message || 'Login failed. Please check your credentials and try again.');
        return;
      }

      const responseData = await response.json();
      console.log("Login response data:", responseData);

      if (responseData.status && responseData.status.code === 200) {
        const { user_id } = responseData.data;

        // Save user data and token in local storage
        localStorage.setItem("token", response.headers.get("Authorization")); // Ensure Authorization header is set if used
        localStorage.setItem("user", JSON.stringify(responseData.data));
        localStorage.setItem("user_id", user_id);

        // Update authentication context
        setAuth(prevAuth => ({
          ...prevAuth,
          user: responseData.data
        }));

        // Display success message and redirect to home
        setMessage("Successfully logged in!");
        setTimeout(() => {
          setMessage(""); // Clear message after 3 seconds
        }, 3000); // Adjust delay as needed
      } else {
        setMessage("An error occurred while logging in. Please try again.");
      }

    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("An error occurred while logging in. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const userInfo = {
      email: formData.get('email'),
      password: formData.get('password')
    };
    await login(userInfo);
    formRef.current.reset();
  };

  const handleClick = (e) => {
    e.preventDefault();
    setShow(false);
  };

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit}>
        Email: <input type="email" name='email' placeholder="email" />
        <br />
        Password: <input type="password" name='password' placeholder="password" />
        <br />
        <input type='submit' value="Login" />
      </form>
      <br />
      {message && <div>{message}</div>} {/* Display success message */}
      <div>Not registered yet, <a href="#signup" onClick={handleClick}>Signup</a> </div>
    </div>
  );
};

export default Login;
