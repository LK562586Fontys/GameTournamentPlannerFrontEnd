export function sanitizeUser(user) {
  if (
    !user ||
    typeof user.token !== 'string' ||
    typeof user.id !== 'number' ||
    typeof user.name !== 'string' ||
    typeof user.emailAddress !== 'string'
  ) {
    throw new Error('Invalid user object');
  }

  return Object.freeze({
    token: user.token.trim(),
    id: user.id,
    name: user.name.trim().slice(0, 100),
    emailAddress: user.emailAddress.trim().toLowerCase(),
  });
}