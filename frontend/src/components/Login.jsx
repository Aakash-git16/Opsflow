import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(credentials);
      onLogin(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setForgotMessage('');

    try {
      await authAPI.forgotPassword(forgotEmail);
      setForgotMessage('If an account with that email exists, a password reset link has been sent.');
      setForgotEmail('');
    } catch (err) {
      setError('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  if (showForgotPassword) {
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleForgotPassword}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
            Reset Password
          </h2>
          
          {error && <div className="error-message">{error}</div>}
          {forgotMessage && <div className="success-message">{forgotMessage}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              placeholder="Enter your email address"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button 
              type="button" 
              className="btn-link"
              onClick={() => setShowForgotPassword(false)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#3498db', 
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
          Welcome to OpsFlow
        </h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={credentials.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              className="form-control"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#7f8c8d',
                fontSize: '0.9rem'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', marginBottom: '1rem' }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button 
            type="button" 
            className="btn-link"
            onClick={() => setShowForgotPassword(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#3498db', 
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Forgot Password?
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#7f8c8d' }}>Don't have an account? </span>
          <button 
            type="button" 
            className="btn-link"
            onClick={onSwitchToRegister}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#3498db', 
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;