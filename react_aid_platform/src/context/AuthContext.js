import React, { createContext, useState, useEffect } from 'react';

// Create AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Mock fetch user
    const fetchUser = async () => {
      const userId = localStorage.getItem('user_id');
      if (userId) {
        // Simulate API call to get user details
        setUser({ id: userId, email: 'user@example.com' });
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
