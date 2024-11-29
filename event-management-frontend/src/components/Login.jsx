import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginUser } from '../services/auth';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email: formData.email,  // Use formData.email instead of email
        password: formData.password,  // Use formData.password instead of password
      });
  
      console.log(data);  // This should include the token and userId
  
      if (data.token) {
        localStorage.setItem('authToken', data.token);  // Store the token with 'authToken' key
        // Optionally, store the userId or other data in context/state
        navigate('/dashboard');  // Redirect to dashboard or home page
      } else {
        alert('No token received');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert('Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '1rem',
    padding: '0.5rem',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default Login;
