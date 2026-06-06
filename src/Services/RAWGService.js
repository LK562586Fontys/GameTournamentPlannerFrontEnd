const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const BASE_URL = import.meta.env.RAWG_API_URL;

export async function searchGames(query) {
  if (!query) {
    return [];
  }

  const response = await fetch(
    `${BASE_URL}?key=${API_KEY}&search=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error('Failed to search games.');
  }

  const data = await response.json();

  return data.results;
}

export async function getGameDetails(gameId) {
  const id = Number(gameId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid game id.');
  }

  const response = await fetch(
    `${BASE_URL}/${id}?key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to get game details.');
  }

  return response.json();
}