const API_KEY = '2e4d67e3eaea4cab87c6b089721bb288';

const BASE_URL = 'https://api.rawg.io/api/games';

export async function searchGames(query) {
  if (!query) {
    return [];
  }

  const response = await fetch(
    `${BASE_URL}?key=${API_KEY}&search=${query}`
  );

  if (!response.ok) {
    throw new Error('Failed to search games.');
  }

  const data = await response.json();

  return data.results;
}

export async function getGameDetails(gameId) {
  const response = await fetch(
    `${BASE_URL}/${gameId}?key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to get game details.');
  }

  const data = await response.json();

  return data;
}