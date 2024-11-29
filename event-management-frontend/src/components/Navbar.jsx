// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isAuthenticated, getCurrentUser } from '../services/auth';

function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <h1>Event Management</h1>
      <div>
        {isAuthenticated() ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/bookings" style={styles.link}>Bookings</Link>
            <Link to="/events" style={styles.link}>Events</Link> {/* New Events Link */}
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#282c34',
    color: 'white',
  },
  link: {
    margin: '0 0.5rem',
    color: 'white',
    textDecoration: 'none',
  },
  button: {
    marginLeft: '1rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
};

export default Navbar;
