export function validatePassword(data) {
  if (!data.currentPassword?.trim()) {
    return 'Current password is required.';
  }

  if (!data.newPassword?.trim()) {
    return 'New password is required.';
  }

  if (data.newPassword.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (data.newPassword !== data.confirmPassword) {
    return 'Passwords do not match.';
  }

  return null;
}