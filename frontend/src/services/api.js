import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token (if you implement refresh token functionality)
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
        // const { access_token } = response.data;
        // localStorage.setItem('token', access_token);
        
        // Retry the original request with the new token
        // originalRequest.headers.Authorization = `Bearer ${access_token}`;
        // return api(originalRequest);
        
        // For now, just clear the token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } catch (error) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    // For other errors, just reject with the error
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/token', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        // Get user data and store it
        const userResponse = await api.get('/users/me/');
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        return userResponse.data; // Return user data on success
      }
      throw new Error('No access token received');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/register/', userData);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        // Set user data in localStorage if needed
        const userResponse = await this.getCurrentUser();
        localStorage.setItem('user', JSON.stringify(userResponse));
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me/');
      return response.data;
    } catch (error) {
      // If not authenticated, clear any existing token
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default api;
