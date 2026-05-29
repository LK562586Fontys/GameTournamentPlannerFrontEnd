const BASE_URL = 'http://localhost:8081/api/tournaments';


export async function getTournaments() {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch tournaments.');
  }

  return response.json();
}

export async function createTournament(data) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create tournament.');
  }

  return result;
}