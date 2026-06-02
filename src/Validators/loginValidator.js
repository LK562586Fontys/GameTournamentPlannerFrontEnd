export function validateLogin(data) {
  if (!data.emailAddress.trim()) {
    return 'Email is required.';
  }

  if (!data.password.trim()) {
    return 'Password is required.';
  }

  return null;
}