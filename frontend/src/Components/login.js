import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username,
        password, 
      });

      console.log(response.data); // Log the response for debugging

      const { token, user } = response.data;
      if (!user || !user._id) {
        throw new Error("User object or _id not found in response");
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user._id); // Store user ID in localStorage

      navigate('/home');
    } catch (error) {
      setError('Invalid username or password');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className='hi'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
