import { getToken } from './AuthService';

export async function getAccountById(id) {
  const response = await fetch(`http://localhost:8081/api/accounts/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch account.');
  }

  return result;
}

export async function updatePassword(id, data) {
  const response = await fetch(
    `http://localhost:8081/api/accounts/${id}/password`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update password.');
  }

  return result;
}

export async function updateEmailAddress(id, data) {
  const response = await fetch(
    `http://localhost:8081/api/accounts/${id}/email`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update email.');
  }

  return result;
}

export async function updateProfile(id, data) {
  const response = await fetch(
    `http://localhost:8081/api/accounts/${id}/profile`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update profile.');
  }

  return result;
}