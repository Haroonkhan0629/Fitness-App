'use server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const API_URL = `${BACKEND_URL}/api/main_app/`;
const AUTH_BASE_URL = `${BACKEND_URL}/api/auth/`;

function bearer(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getExercises(token, mine = false) {
  const url = mine ? `${API_URL}?mine=1` : API_URL;
  const res = await fetch(url, { headers: bearer(token), cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return res.json();
}

export async function deleteExercise(token, id) {
  const res = await fetch(`${API_URL}${id}/`, { method: 'DELETE', headers: bearer(token) });
  if (!res.ok) throw new Error('Failed to delete exercise');
}

export async function toggleBookmark(token, exerciseId) {
  const res = await fetch(`${API_URL}${exerciseId}/bookmarks/`, { method: 'PUT', headers: bearer(token) });
  if (!res.ok) throw new Error('Failed to toggle bookmark');
}

export async function createExercise(token, formData) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...bearer(token) },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error('Failed to create exercise');
}

export async function updateExercise(token, id, formData) {
  const res = await fetch(`${API_URL}${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...bearer(token) },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error('Failed to update exercise');
}

export async function getUserHello(token) {
