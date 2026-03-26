import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard';
import RequestForm from './components/RequestForm';
import RequestList from './components/RequestList';
import { authAPI } from './services/api';
import './App.css';

// Email verification component
const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      authAPI.verifyEmail(token)
        .then(response => {
          setMessage(response.data.message);
          setIsSuccess(true);
        })
        .catch(error => {
          setMessage(error.response?.data?.error || 'Verification failed');
          setIsSuccess(false);
        });
    } else {
      setMessage('Invalid verification link');
      setIsSuccess(false);
    }
  }, [searchParams]);

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
          Email Verification
        </h2>
        <div className={isSuccess ? 'success-message' : 'error-message'}>
          {message}
        </div>
        {isSuccess && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="/" className="btn btn-primary">Go to Login</a>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      // Validate token with backend
      authAPI.validateToken()
        .then(response => {
          if (response.data.valid) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#2c3e50'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route 
            path="/verify-email" 
            element={<EmailVerification />} 
          />
          <Route 
            path="*" 
            element={
              showRegister ? (
                <Register onSwitchToLogin={() => setShowRegister(false)} />
              ) : (
                <Login 
                  onLogin={handleLogin} 
                  onSwitchToRegister={() => setShowRegister(true)}
                />
              )
            } 
          />
        </Routes>
      </Router>
    );
  }

  const getDashboardComponent = () => {
    switch (user.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'MANAGER':
        return <ManagerDashboard />;
      case 'EMPLOYEE':
      default:
        return <EmployeeDashboard />;
    }
  };

  const Navbar = () => (
    <nav className="navbar">
      <h1>OpsFlow</h1>
      <div className="navbar-right">
        <span>Welcome, {user.fullName} ({user.role})</span>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );

  return (
    <div className="app">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={getDashboardComponent()} />
          <Route path="/requests" element={<RequestList />} />
          <Route path="/create-request" element={<RequestForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;