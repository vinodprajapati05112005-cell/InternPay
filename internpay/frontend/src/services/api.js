const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const REQUEST_TIMEOUT_MS = 10_000;
const AUTH_STORAGE_KEY = 'internpay_auth';
export const AUTH_SESSION_EVENT = 'internpay:auth-session-changed';

let refreshSessionPromise = null;

class ApiError extends Error {
  constructor(message, { status = 0, errors = null, payload = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.payload = payload;
  }
}

const extractErrorMessage = (value) => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = extractErrorMessage(item);
      if (message) {
        return message;
      }
    }
    return '';
  }

  if (typeof value === 'object') {
    for (const item of Object.values(value)) {
      const message = extractErrorMessage(item);
      if (message) {
        return message;
      }
    }
  }

  return '';
};

const buildErrorMessage = (payload, response, fallback) => {
  const nested = extractErrorMessage(payload?.errors) || extractErrorMessage(payload?.error);
  if (nested) {
    return nested;
  }

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message.trim();
  }

  if (typeof payload?.detail === 'string' && payload.detail.trim()) {
    return payload.detail.trim();
  }

  return response?.statusText || fallback;
};

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
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT, { detail: session }));
  return session;
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT, { detail: null }));
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
  if (refreshSessionPromise) {
    return refreshSessionPromise;
  }

  const stored = getStoredAuth();
  const refreshToken = stored?.refreshToken;

  if (!refreshToken) {
    return null;
  }

  refreshSessionPromise = (async () => {
    try {
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
        throw new ApiError(buildErrorMessage(payload, response, 'Unable to refresh session'), {
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

      if (!nextSession.accessToken || !nextSession.refreshToken) {
        throw new ApiError('Unable to refresh session', {
          status: response.status,
          errors: payload?.errors,
          payload,
        });
      }

      setStoredAuth(nextSession);
      return nextSession;
    } catch (error) {
      clearStoredAuth();
      throw error;
    } finally {
      refreshSessionPromise = null;
    }
  })();

  return refreshSessionPromise;
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers: requestHeaders,
      body: data === undefined || data === null ? undefined : isFormData ? data : JSON.stringify(data),
      credentials: 'same-origin',
      signal: controller.signal,
    });
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new ApiError('Request timed out. The server may be starting up — please try again in a moment.', { status: 0 });
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  const payload = await safeJson(response);

  if (response.status === 401 && auth && retryOnAuthFailure && getStoredAuth()?.refreshToken) {
    try {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return request(path, {
          method,
          data,
          headers,
          auth,
          retryOnAuthFailure: false,
        });
      }
    } catch {
      clearStoredAuth();
    }
    clearStoredAuth();
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(buildErrorMessage(payload, response, 'Request failed'), {
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
  accept: (id) => api.post(`/api/contracts/${id}/accept/`, {}),
  reject: (id) => api.post(`/api/contracts/${id}/reject/`, {}),
  pause: (id) => api.post(`/api/contracts/${id}/pause/`, {}),
  unpause: (id) => api.post(`/api/contracts/${id}/unpause/`, {}),
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

export const notificationApi = {
  list: () => api.get('/api/notifications/'),
  read: (id) => api.post(`/api/notifications/${id}/read/`, {}),
  readAll: () => api.post('/api/notifications/read-all/', {}),
};

export { API_BASE_URL, ApiError, buildUrl };
