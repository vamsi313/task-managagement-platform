const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Helper to get the auth headers containing the JWT token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Standard fetch wrapper with automatic error parsing
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized (session expired or invalid token)
    if (response.status === 401) {
      // Clear token if unauthorized
      if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/signup')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChange'));
      }
    }

    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      let errorMessage = 'An error occurred. Please try again.';
      if (data) {
        if (data.message) {
          errorMessage = data.message;
        } else if (data.messages) {
          errorMessage = Object.values(data.messages).join(', ');
        } else if (data.error) {
          errorMessage = data.error;
        }
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ================= AUTH APIs =================
export const loginApi = async (credentials) => {
  return await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const signupApi = async (userData) => {
  return await request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const logoutApi = async () => {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (e) {
    // Ignore server error on logout
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChange'));
  }
};

// ================= TASK APIs =================
export const getTasksApi = async () => {
  return await request('/tasks');
};

export const getTaskByIdApi = async (id) => {
  return await request(`/tasks/${id}`);
};

export const createTaskApi = async (taskData) => {
  return await request('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
};

export const updateTaskApi = async (id, taskData) => {
  return await request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
};

export const updateTaskStatusApi = async (id, status) => {
  return await request(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const deleteTaskApi = async (id) => {
  return await request(`/tasks/${id}`, {
    method: 'DELETE',
  });
};

// ================= USER APIs =================
export const getUsersApi = async () => {
  return await request('/users');
};
