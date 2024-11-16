// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={styles.container}>
      <h2>404 - Page Not Found</h2>
      <p>Return to <Link to="/">Home</Link>.</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
  },
};

export default NotFound;
