import React, { useRef, useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const Login = ({ setShow }) => {
  const formRef = useRef();
  const { setAuth } = useContext(AuthContext);

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
        throw new Error('Login failed');
      }

      const responseData = await response.json();
      const { user_id } = responseData.data; // Access user_id from the nested structure

      localStorage.setItem("token", response.headers.get("Authorization"));
      localStorage.setItem("user", JSON.stringify(responseData.data)); // Store user data in localStorage
      localStorage.setItem("user_id", user_id); // Store user_id locally

      setAuth(prevAuth => ({
        ...prevAuth,
        user: responseData.data
      })); // Update user in auth context

      console.log("Logged in user:", responseData.data); // Verify user data

    } catch (error) {
      console.error("Error logging in:", error);
      // Handle login error, e.g., show error message to user
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
      <div>Not registered yet, <a href="#signup" onClick={handleClick}>Signup</a> </div>
    </div>
  );
};

export default Login;
