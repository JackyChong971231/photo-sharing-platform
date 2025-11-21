import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSharedContext } from '../../SharedContext';
import './login.css'; // import the stylesheet

export const Login = () => {
  const { login } = useSharedContext();
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials);
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue</p>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-button">Login</button>

        <p className="login-footer">
          Don’t have an account? <a href="/register">Sign up</a>
        </p>
      </form>
    </div>
  );
};
