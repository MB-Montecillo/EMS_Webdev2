// src/services/auth.js

// Try the default import first; switch to the named import if it doesn't work
import jwtDecode from 'jwt-decode'; // If this fails, try { decode as jwtDecode }

export function login(token) {
  localStorage.setItem('token', token);
}

export function logout() {
  localStorage.removeItem('token');
}

export function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}
