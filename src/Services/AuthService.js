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