const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const AUTH_STORAGE_KEY = 'internpay_auth';

class ApiError extends Error {
  constructor(message, { status = 0, errors = null, payload = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.payload = payload;
  }
}

const buildUrl = (path) => {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredAuth = (session) => {
  if (typeof window === 'undefined') {
    return session;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const normalizeAuthPayload = (payload) => {
  const data = payload?.data ?? payload ?? {};
  const tokens = data.tokens ?? data.token ?? {};
  return {
    user: data.user ?? null,
    accessToken: tokens.access || tokens.access_token || data.access || data.access_token || null,
    refreshToken: tokens.refresh || tokens.refresh_token || data.refresh || data.refresh_token || null,
  };
};

const refreshAccessToken = async () => {
  const stored = getStoredAuth();
  const refreshToken = stored?.refreshToken;

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(buildUrl('/api/auth/refresh/'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const payload = await safeJson(response);
  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.message || response.statusText || 'Unable to refresh session', {
      status: response.status,
      errors: payload?.errors,
      payload,
    });
  }

  const tokens = payload?.data ?? payload ?? {};
  const nextSession = {
    ...stored,
    accessToken: tokens.access || tokens.access_token || tokens.accessToken || stored?.accessToken || null,
    refreshToken: tokens.refresh || tokens.refresh_token || tokens.refreshToken || stored?.refreshToken || null,
  };
  setStoredAuth(nextSession);
  return nextSession;
};

export const request = async (
  path,
  {
    method = 'GET',
    data,
    headers = {},
    auth = true,
    retryOnAuthFailure = true,
  } = {},
) => {
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  if (data !== undefined && data !== null && !isFormData && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const stored = getStoredAuth();
    if (stored?.accessToken) {
      requestHeaders.Authorization = `Bearer ${stored.accessToken}`;
    }
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: requestHeaders,
    body: data === undefined || data === null ? undefined : isFormData ? data : JSON.stringify(data),
    credentials: 'same-origin',
  });

  const payload = await safeJson(response);

  if (response.status === 401 && auth && retryOnAuthFailure && getStoredAuth()?.refreshToken) {
    try {
      await refreshAccessToken();
      return request(path, {
        method,
        data,
        headers,
        auth,
        retryOnAuthFailure: false,
      });
    } catch {
      clearStoredAuth();
    }
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.message || response.statusText || 'Request failed', {
      status: response.status,
      errors: payload?.errors || payload?.error || null,
      payload,
    });
  }

  return payload?.data ?? payload ?? null;
};

export const api = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, data, options = {}) => request(path, { ...options, method: 'POST', data }),
  patch: (path, data, options = {}) => request(path, { ...options, method: 'PATCH', data }),
  put: (path, data, options = {}) => request(path, { ...options, method: 'PUT', data }),
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
};

export const authApi = {
  login: (data) => api.post('/api/auth/login/', data, { auth: false }),
  register: (data) => api.post('/api/auth/register/', data, { auth: false }),
  logout: (refreshToken) => api.post('/api/auth/logout/', { refresh_token: refreshToken }),
  profile: () => api.get('/api/auth/profile/'),
  updateProfile: (data) => api.patch('/api/auth/profile/', data),
  permissions: () => api.get('/api/auth/permissions/'),
  refresh: (refreshToken) => api.post('/api/auth/refresh/', { refresh_token: refreshToken }, { auth: false }),
};

export const companyApi = {
  profile: () => api.get('/api/companies/profile/'),
  updateProfile: (data) => api.patch('/api/companies/profile/', data),
  dashboard: () => api.get('/api/companies/dashboard/'),
};

export const studentApi = {
  profile: () => api.get('/api/students/profile/'),
  updateProfile: (data) => api.patch('/api/students/profile/', data),
  dashboard: () => api.get('/api/students/dashboard/'),
  contracts: () => api.get('/api/students/contracts/'),
  payments: () => api.get('/api/students/payments/'),
};

export const judgeApi = {
  profile: () => api.get('/api/judges/profile/'),
  updateProfile: (data) => api.patch('/api/judges/profile/', data),
  dashboard: () => api.get('/api/judges/dashboard/'),
  decisionHistory: () => api.get('/api/judges/decision-history/'),
};

export const contractApi = {
  list: () => api.get('/api/contracts/'),
  detail: (id) => api.get(`/api/contracts/${id}/`),
  create: (data) => api.post('/api/contracts/', data),
  update: (id, data) => api.patch(`/api/contracts/${id}/`, data),
  remove: (id) => api.delete(`/api/contracts/${id}/`),
  assignStudent: (id, data) => api.post(`/api/contracts/${id}/assign-student/`, data),
  addMilestones: (id, data) => api.post(`/api/contracts/${id}/milestones/`, data),
  cancel: (id, data = {}) => api.post(`/api/contracts/${id}/cancel/`, data),
  fund: (id, data = {}) => api.post(`/api/contracts/${id}/fund/`, data),
  dashboard: () => api.get('/api/contracts/dashboard/'),
};

export const submissionApi = {
  list: () => api.get('/api/submissions/'),
  detail: (id) => api.get(`/api/submissions/${id}/`),
  create: (data) => api.post('/api/submissions/', data),
  update: (id, data) => api.patch(`/api/submissions/${id}/`, data),
  remove: (id) => api.delete(`/api/submissions/${id}/`),
  report: (id) => api.get(`/api/submissions/${id}/report/`),
};

export const disputeApi = {
  list: () => api.get('/api/disputes/'),
  detail: (id) => api.get(`/api/disputes/${id}/`),
  create: (data) => api.post('/api/disputes/', data),
  resolve: (id, data) => api.post(`/api/disputes/${id}/resolve/`, data),
  assigned: () => api.get('/api/disputes/assigned/'),
  completed: () => api.get('/api/disputes/completed/'),
  history: () => api.get('/api/disputes/history/'),
};

export const aiApi = {
  health: () => api.get('/api/ai/health/'),
  evaluateSubmission: (submissionId) => api.post(`/api/ai/submissions/${submissionId}/evaluate/`, {}),
};

export { API_BASE_URL, ApiError, buildUrl };
