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

/**
 * Logout user - clear auth data
 */
export function logoutUser() {
  AuthService.clearAuth();
}

// ============================================
// PRODUCTS API
// ============================================

/**
 * Get all products for the company
 * @param {Object} options - Query options { page: 0, limit: 10, category: categoryId, search: searchTerm }
 * @returns {Promise<Object>} Products list with pagination
 */
export async function getProducts(options = {}) {
  const params = new URLSearchParams();
  if (options.page !== undefined) params.append('page', options.page);
  if (options.limit !== undefined) params.append('limit', options.limit);
  if (options.category) params.append('category', options.category);
  if (options.search) params.append('search', options.search);

  const response = await fetch(`${API_BASE_URL}/api/products?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch products');
  }

  return data;
}

/**
 * Get a single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product details
 */
export async function getProductById(productId) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch product');
  }

  return data;
}

/**
 * Create a new product
 * @param {Object} productData - { name, sku, category, price, stock }
 * @returns {Promise<Object>} Created product data
 */
export async function createProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create product');
  }

  return data;
}

/**
 * Update an existing product
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product data
 */
export async function updateProduct(productId, productData) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update product');
  }

  return data;
}

/**
 * Delete a product
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteProduct(productId) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete product');
  }

  return data;
}

// ============================================
// CATEGORIES API
// ============================================

/**
 * Get all categories for the company
 * @returns {Promise<Object>} Categories list
 */
export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/api/category`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch categories');
  }

  return data;
}

/**
 * Create a new category
 * @param {Object} categoryData - { name }
 * @returns {Promise<Object>} Created category data
 */
export async function createCategory(categoryData) {
  const response = await fetch(`${API_BASE_URL}/api/category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create category');
  }

  return data;
}

/**
 * Update an existing category
 * @param {string} categoryId - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category data
 */
export async function updateCategory(categoryId, categoryData) {
  const response = await fetch(`${API_BASE_URL}/api/category/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update category');
  }

  return data;
}

/**
 * Delete a category
 * @param {string} categoryId - Category ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteCategory(categoryId) {
  const response = await fetch(`${API_BASE_URL}/api/category/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete category');
  }

  return data;
}

// ============================================
// USERS API
// ============================================

/**
 * Get all users for the company
 * @param {Object} options - Query options { page: 0, limit: 10, search: searchTerm }
 * @returns {Promise<Object>} Users list
 */
export async function getUsers(options = {}) {
  const params = new URLSearchParams();
  if (options.page !== undefined) params.append('page', options.page);
  if (options.limit !== undefined) params.append('limit', options.limit);
  if (options.search) params.append('search', options.search);

  const response = await fetch(`${API_BASE_URL}/api/users?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch users');
  }

  return data;
}

/**
 * Get a single user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User details
 */
export async function getUserById(userId) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user');
  }

  return data;
}

/**
 * Add a new user to the company
 * @param {Object} userData - { name, email, phone, role, password }
 * @returns {Promise<Object>} Created user data
 */
export async function addUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add user');
  }

  return data;
}

/**
 * Update user details
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUser(userId, userData) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user');
  }

  return data;
}

/**
 * Delete a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteUser(userId) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete user');
  }

  return data;
}

// ============================================
// SUBSCRIPTION/PLANS API
// ============================================

/**
 * Get product statistics for dashboard
 * @returns {Promise<Object>} Product stats including inventory value, low stock alerts, etc.
 */
export async function getProductStats() {
  const response = await fetch(`${API_BASE_URL}/api/products/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch product stats');
  }

  return data;
}

/**
 * Get low stock products
 * @returns {Promise<Object>} Low stock products list
 */
export async function getLowStockProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products/low-stock`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch low stock products');
  }

  return data;
}

/**
 * Get subscription plans
 * @returns {Promise<Object>} Available plans
 */
export async function getPlans() {
  const response = await fetch(`${API_BASE_URL}/api/company/plan`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch plans');
  }

  return data;
}
