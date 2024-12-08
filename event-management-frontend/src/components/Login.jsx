import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic validation
    if (!formData.email || !formData.password) {
      alert('Please fill in both fields');
      return;
    }

    setLoading(true); // Set loading to true
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      const { data } = response;

      console.log('Login successful:', data); // Debugging purpose

      if (data.token) {
        localStorage.setItem('authToken', data.token); // Store token in localStorage
        localStorage.setItem('userId', data.userId); 
        //navigate('/dashboard'); // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        alert('Login failed: No token received');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      console.error('Login error:', errorMessage);
      alert(errorMessage); // Display error message
    } finally {
      setLoading(false); // Reset loading state
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
