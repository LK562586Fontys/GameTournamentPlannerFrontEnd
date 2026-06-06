import { sanitizeUser } from './sanitizeUser.js';

export async function registerUser(data) {
  const response = await fetch('http://localhost:8081/api/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Registration failed.');
  }

  return result;
}

export async function loginUser(data) {
  const response = await fetch('http://localhost:8081/api/accounts/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Login failed.');
  }

  return sanitizeUser(result);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user'));
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}