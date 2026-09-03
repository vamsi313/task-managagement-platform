import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutApi } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const userStr = localStorage.getItem('user');
      setCurrentUser(userStr ? JSON.parse(userStr) : null);
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    await logoutApi();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">✓</div>
          <span>Task Management</span>
        </Link>

        {currentUser ? (
          <div className="navbar-menu">
            <Link
              to="/dashboard"
              className={`nav-link ${location.pathname === '/dashboard' || location.pathname === '/' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to="/create-task"
              className={`nav-link ${location.pathname === '/create-task' ? 'active' : ''}`}
            >
              + Create Task
            </Link>

            <div className="user-tag">
              <span>{currentUser.name}</span>
              <span className={`role-badge ${currentUser.role === 'ADMIN' ? 'admin' : ''}`}>
                {currentUser.role}
              </span>
            </div>

            <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link
              to="/login"
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary btn-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
