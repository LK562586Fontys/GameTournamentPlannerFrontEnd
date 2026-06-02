const BASE_URL = 'http://localhost:8081/api/tournaments';


import { getToken } from './AuthService';

export async function getTournaments() {
  const token = getToken();

  const response = await fetch(
    'http://localhost:8081/api/tournaments',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch tournaments.');
  }

  return response.json();
}

export async function createTournament(data) {
  const token = getToken();
  
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create tournament.');
  }

  return result;
}