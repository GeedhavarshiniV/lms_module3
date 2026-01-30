import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isTrainer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        LMS - Learning Platform
      </Link>

      {user && (
        <ul className="navbar-links">
          <li>
            <Link to="/courses">My Courses</Link>
          </li>
          {isTrainer() && (
            <li>
              <Link to="/courses/create">Create Course</Link>
            </li>
          )}
        </ul>
      )}

      <div className="navbar-user">
        {user ? (
          <>
            <span>Welcome, {user.name || user.email}</span>
            <span className="course-status status-published">{user.role}</span>
            <button onClick={handleLogout} className="btn btn-secondary btn-small">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-small">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;