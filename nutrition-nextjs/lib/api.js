const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const API_URL = `${BACKEND_URL}/api/main_app/`;
const AUTH_URL = `${BACKEND_URL}/api/auth/`;
let refreshInProgress;

function bearer(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isAccessTokenValid(token) {
  try {
    const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(
      atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '='))
    );
    return Number.isFinite(payload.exp) && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function clearSession() {
  localStorage.removeItem('fit2go_access');
  localStorage.removeItem('fit2go_refresh');
  localStorage.removeItem('fit2go_profile');
  window.dispatchEvent(new Event('fit2go:session-expired'));
}

export async function refreshAccessToken() {
  if (refreshInProgress) return refreshInProgress;

  const refresh = localStorage.getItem('fit2go_refresh');
  if (!refresh) {
    clearSession();
    return null;
  }

  refreshInProgress = (async () => {
    const response = await fetch(`${AUTH_URL}token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    const tokens = await response.json();
    if (!response.ok || !tokens.access || !tokens.refresh) {
      if (response.status === 400 || response.status === 401) clearSession();
      throw new Error(tokens.detail || `Token refresh failed (${response.status})`);
    }

    localStorage.setItem('fit2go_access', tokens.access);
    localStorage.setItem('fit2go_refresh', tokens.refresh);
    window.dispatchEvent(
      new CustomEvent('fit2go:token-refreshed', { detail: { access: tokens.access } })
    );
    return tokens.access;
  })();

  try {
    return await refreshInProgress;
  } finally {
    refreshInProgress = null;
  }
}

async function authenticatedFetch(url, options, initialToken) {
  let token = localStorage.getItem('fit2go_access') || initialToken;
  if (token && !isAccessTokenValid(token)) {
    token = await refreshAccessToken();
  }

  const sendRequest = (accessToken) => {
    const headers = new Headers(options.headers || {});
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    else headers.delete('Authorization');
    return fetch(url, { ...options, headers });
  };

  let response = await sendRequest(token);
  if (response.status === 401 && token) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) response = await sendRequest(refreshedToken);
  }
  return response;
}

export async function getExercises(token, mine = false) {
  const url = mine ? `${API_URL}?mine=1` : API_URL;
  const res = await authenticatedFetch(
    url,
    { headers: bearer(token), cache: 'no-store' },
    token
  );
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return res.json();
}

export async function deleteExercise(token, id) {
  const res = await authenticatedFetch(
    `${API_URL}${id}/`,
    { method: 'DELETE', headers: bearer(token) },
    token
  );
  if (!res.ok) throw new Error('Failed to delete exercise');
}

export async function toggleBookmark(token, exerciseId) {
  const res = await authenticatedFetch(
    `${API_URL}${exerciseId}/bookmarks/`,
    { method: 'PUT', headers: bearer(token) },
    token
  );
  if (!res.ok) throw new Error('Failed to toggle bookmark');
}

export async function createExercise(token, formData) {
  const res = await authenticatedFetch(
    API_URL,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...bearer(token) },
      body: JSON.stringify(formData),
    },
    token
  );
  if (!res.ok) throw new Error('Failed to create exercise');
}

export async function updateExercise(token, id, formData) {
  const res = await authenticatedFetch(
    `${API_URL}${id}/`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...bearer(token) },
      body: JSON.stringify(formData),
    },
    token
  );
  if (!res.ok) throw new Error('Failed to update exercise');
}

export async function getUserHello(token) {
  const res = await authenticatedFetch(
    `${AUTH_URL}hello/`,
    { headers: bearer(token), cache: 'no-store' },
    token
  );
  if (!res.ok) throw new Error('Failed to fetch user greeting');
  return res.json();
}
