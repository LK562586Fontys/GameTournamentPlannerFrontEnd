/// <reference types="vitest" />
import '@testing-library/jest-dom';

import { validateTournament } from '../../../Validators/tournamentValidator';

describe('validateTournament', () => {
  const createTournamentData = (overrides = {}) => ({
    name: 'Chess Tournament',
    gameId: '18753',
    rules: 'Standard chess rules apply.',
    maxParticipants: 16,
    ...overrides,
  });

  it('should return error if name is empty', () => {
    expect(
      validateTournament(createTournamentData({ name: '' }))
    ).toBe('Tournament name is required.');
  });

  it('should return error if game is empty', () => {
    expect(
      validateTournament(createTournamentData({ gameId: '' }))
    ).toBe('Game selection is required.');
  });

  it('should return error if maxParticipants is less than 2', () => {
    expect(
      validateTournament(createTournamentData({ maxParticipants: -1 }))
    ).toBe('Max participants must be positive.');
  });

  it('should return error if maxParticipants is not a power of 2', () => {
    expect(
      validateTournament(createTournamentData({ maxParticipants: 15 }))
    ).toBe('Max participants must be a power of 2.');
  });

    it('should return error if maxParticipants is not a number', () => {
        expect(
            validateTournament(
          createTournamentData({ maxParticipants: 'not-a-number' })
        )
     ).toBe('Max participants must be a number.');
    });

  it('should return null if all fields are valid', () => {
    expect(validateTournament(createTournamentData())).toBeNull();
  });
});