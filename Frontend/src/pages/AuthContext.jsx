// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [error, setError] = useState('');

const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('jwtToken', response.data.token);
      const userResponse = await axios.get('http://localhost:3000/api/rooms/profile', {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
      setUser({ email: userResponse.data.email, username: userResponse.data.name });
      // alert(user)
      setError('');
    } else {
      setError('Login failed. Please check your credentials.');
    }
  } catch (err) {
    alert(err)
    setError('Error during login. Please try again.');
  }
};

const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get('http://localhost:3000/api/rooms/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Fetched User:', response.data);
    // console.log( response.data.user.email);
    setUser({ email: response.data.user.email, username: response.data.user.name });
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
  };

  // useEffect(() => {
  //   const token = localStorage.getItem('jwtToken');
  //   if (token) {
  //     fetchUserProfile();
  //   }
  // }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, error, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
