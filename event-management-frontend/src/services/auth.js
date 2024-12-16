import jwtDecode from 'jwt-decode'; 

export function login(token) {
  localStorage.setItem('authToken', token);
}

export function logout() {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}

export const getCurrentUser = () => {
  const token = localStorage.getItem('authToken');  
  if (token) {
    try {
      const decoded = jwtDecode(token);  
      const currentTime = Date.now() / 1000;  

      if (decoded.exp < currentTime) {
        console.error('Token has expired');
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
