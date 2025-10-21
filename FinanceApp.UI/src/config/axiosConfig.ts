import axios from 'axios';

const api = axios.create();

api.interceptors.response.use(
  response => response,
  error => {
    // Log the error for debugging
    console.error('AXIOS ERROR:', error);
    if (
      error.response &&
      error.response.status === 401
    ) {
      localStorage.removeItem('token');
      window.location.replace('/login?expired=1');
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }
    return Promise.reject(error);
  }
);

export default api;
