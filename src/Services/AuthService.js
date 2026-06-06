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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Login failed.');
  }
  
  if (
    !result ||
    typeof result.token !== 'string' ||
    typeof result.id !== 'number' ||
    typeof result.name !== 'string' ||
    typeof result.emailAddress !== 'string'
  ) {
    throw new Error('Invalid server response');
  }

  // Return ONLY trusted data (taint removed)
  return {
    token: result.token.trim(),
    id: result.id,
    name: result.name.trim().slice(0, 100),
    emailAddress: result.emailAddress.trim().toLowerCase(),
  };
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