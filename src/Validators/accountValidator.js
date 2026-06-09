export function validateAccount(data) {
  if (!data.name?.trim()) {
    return 'Name is required.';
  }

  if (data.biography && data.biography.length > 500) {
    return 'Biography cannot exceed 500 characters.';
  }

  return null;
}