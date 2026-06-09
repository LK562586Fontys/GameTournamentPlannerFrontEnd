export function validateEmail(data) {
  if (!data.email?.trim()) {
    return 'Email is required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(data.email)) {
    return 'Invalid email address.';
  }

  return null;
}