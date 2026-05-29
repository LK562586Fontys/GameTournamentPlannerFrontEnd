export function validateTournament(data) {
  if (!data.name.trim()) {
    return 'Tournament name is required.';
  }

  if (!data.rules.trim()) {
    return 'Tournament rules are required.';
  }

  if (!data.gameId) {
    return 'Game selection is required.';
  }

  if (Number.isNaN(Number(data.maxParticipants))) {
    return 'Max participants must be a number.';
  }

  if (Number(data.maxParticipants) <= 0) {
    return 'Max participants must be positive.';
  }

  if (Math.log2(Number(data.maxParticipants)) % 1 !== 0) {
    return 'Max participants must be a power of 2.';
  }

  return null;
}