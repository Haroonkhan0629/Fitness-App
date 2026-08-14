'use server';

import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const API_URL = `${BACKEND_URL}/api/main_app/`;
const AUTH_BASE_URL = `${BACKEND_URL}/api/auth/`;
const TOKEN_REFRESH_URL = `${BACKEND_URL}/api/auth/token/refresh/`;

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

// Refreshes the access token using the stored refresh cookie, updates the cookie, returns new token.
async function silentRefresh() {
  const refresh = cookies().get('fit2go_refresh')?.value;
  if (!refresh) throw new Error('Not authenticated');
  const res = await fetch(TOKEN_REFRESH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) throw new Error('Session expired');
  const { access } = await res.json();
  cookies().set('fit2go_access', access, { ...COOKIE_OPTS, maxAge: 5 * 60 });
  return access;
}

// Runs makeFetch(token), retries once with a refreshed token on 401.
async function authedFetch(makeFetch) {
  let token = cookies().get('fit2go_access')?.value;
  let res = await makeFetch(token);
  if (res.status === 401) {
    token = await silentRefresh();
    res = await makeFetch(token);
  }
  return res;
}

function bearer(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getExercises(mine = false) {
  const url = mine ? `${API_URL}?mine=1` : API_URL;
  const res = await authedFetch((token) =>
    fetch(url, { headers: bearer(token), cache: 'no-store' })
  );
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return res.json();
}

export async function deleteExercise(id) {
  const res = await authedFetch((token) =>
    fetch(`${API_URL}${id}/`, { method: 'DELETE', headers: bearer(token) })
  );
  if (!res.ok) throw new Error('Failed to delete exercise');
}

export async function toggleBookmark(exerciseId) {
  const res = await authedFetch((token) =>
    fetch(`${API_URL}${exerciseId}/bookmarks/`, { method: 'PUT', headers: bearer(token) })
  );
  if (!res.ok) throw new Error('Failed to toggle bookmark');
}

export async function createExercise(formData) {
  const res = await authedFetch((token) =>
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...bearer(token) },
      body: JSON.stringify(formData),
    })
  );
  if (!res.ok) throw new Error('Failed to create exercise');
}

export async function updateExercise(id, formData) {
  const res = await authedFetch((token) =>
    fetch(`${API_URL}${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...bearer(token) },
      body: JSON.stringify(formData),
    })
  );
  if (!res.ok) throw new Error('Failed to update exercise');
}

export async function getUserHello() {
  const res = await authedFetch((token) =>
    fetch(`${AUTH_BASE_URL}hello/`, {
      headers: { 'Content-Type': 'application/json', ...bearer(token) },
      cache: 'no-store',
    })
  );
  if (!res.ok) throw new Error('Failed to fetch user data');
  return res.json();
}

export async function registerUser(profileData) {
  const res = await fetch(`${AUTH_BASE_URL}register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error('Failed to register user');
}

// Calls Django login, then stores both tokens as HTTP-only cookies.
export async function loginUser(username, password) {
  const res = await fetch(`${AUTH_BASE_URL}login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const { access, refresh } = await res.json();
  cookies().set('fit2go_access', access, { ...COOKIE_OPTS, maxAge: 5 * 60 });
  cookies().set('fit2go_refresh', refresh, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 });
}

export async function logoutAction() {
  cookies().delete('fit2go_access');
  cookies().delete('fit2go_refresh');
}
