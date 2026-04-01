// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Auth Service - handles token and user data storage
 */
export const AuthService = {
  // Token Management
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // User Data Management
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Company Data Management
  setCompany: (company) => {
    localStorage.setItem('company', JSON.stringify(company));
  },

  getCompany: () => {
    const company = localStorage.getItem('company');
    return company ? JSON.parse(company) : null;
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get auth header for API calls
  getAuthHeader: () => {
    const token = AuthService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

/**
 * Register a new user and company
 * @param {Object} formData - Registration data with company_name, name, email, phone, password, address
 * @returns {Promise<Object>} Response with user, token, and company
 */
export async function registerUser(formData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration Failed');
  }

  // Store auth data
  if (data.token) {
    AuthService.setToken(data.token);
    AuthService.setUser(data.user);
    AuthService.setCompany(data.company);
  }

  return data;
}

/**
 * Login user with email or phone
 * @param {string} email - User email (optional if phone provided)
 * @param {string} phone - User phone (optional if email provided)
 * @param {string} password - User password
 * @returns {Promise<Object>} Response with user, token, and company
 */
export async function loginUser(email, phone, password) {
  const credentials = { password };

  // Add email or phone to credentials
  if (email) {
    credentials.email = email;
  }
  if (phone) {
    credentials.phone = phone;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Store auth data
  if (data.token) {
    AuthService.setToken(data.token);
    AuthService.setUser(data.user);
    AuthService.setCompany(data.company);
  }

  return data;
}
