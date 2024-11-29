import jwtDecode from 'jwt-decode';  // Correct import

export function login(token) {
  localStorage.setItem('authToken', token);
}

export function logout() {
  localStorage.removeItem('authToken');
}

export const getCurrentUser = () => {
  const token = localStorage.getItem('authToken');  // Ensure you're using the same key
  if (token) {
    try {
      const decoded = jwtDecode(token);  // Correct function name is 'jwtDecode'
      const currentTime = Date.now() / 1000;  // Current time in seconds

      if (decoded.exp < currentTime) {
        console.error('Token has expired');
        // Handle token expiration (e.g., log out user, redirect to login)
      } else {
        console.log('Token is valid');
      }

      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  } else {
    console.error('No token found');
  }
};

export function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}
