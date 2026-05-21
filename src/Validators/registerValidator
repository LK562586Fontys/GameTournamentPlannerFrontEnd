export function validateRegister(data) {
  if (!data.name.trim()) {
    return 'Name is required.';
  }

  if (!data.emailAddress.trim()) {
    return 'Email is required.';
  }

  if (!data.emailAddress.includes('@')) {
    return 'Invalid email.';
  }

  if (data.password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return null;
}