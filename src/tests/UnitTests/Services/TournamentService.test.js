/// <reference types="vitest" />

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTournaments, createTournament } from '../../../Services/TournamentService.js';
import { getToken } from '../../../Services/AuthService.js';

vi.mock('../../../Services/AuthService.js', () => ({
  getToken: vi.fn(),
}));

describe('TournamentService', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getTournaments', () => {

    it('should successfully fetch tournaments', async () => {

      const mockResponse = [
        { id: 1, name: 'Tournament A' },
        { id: 2, name: 'Tournament B' }
      ];

      getToken.mockReturnValue('fake-token');

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
      );

      const result = await getTournaments();

      expect(fetch).toHaveBeenCalledOnce();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8081/api/tournaments',
        {
          headers: {
            Authorization: `Bearer fake-token`,
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetching tournaments fails', async () => {

      getToken.mockReturnValue('fake-token');

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        })
      );

      await expect(getTournaments())
        .rejects
        .toThrow('Failed to fetch tournaments.');
    });
  });

  describe('createTournament', () => {

    it('should successfully create a tournament', async () => {

      const mockResponse = {
        id: 1,
        name: 'New Tournament'
      };

      const tournamentData = {
        name: 'New Tournament'
      };

      getToken.mockReturnValue('fake-token');

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
      );

      const result = await createTournament(tournamentData);

      expect(fetch).toHaveBeenCalledOnce();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8081/api/tournaments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer fake-token`,
          },
          body: JSON.stringify(tournamentData),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when tournament creation fails with message', async () => {

      const errorResponse = {
        message: 'Tournament name already exists.'
      };

      getToken.mockReturnValue('fake-token');

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve(errorResponse),
        })
      );

      await expect(createTournament({ name: 'Test' }))
        .rejects
        .toThrow('Tournament name already exists.');
    });

    it('should throw default error message when no message is provided', async () => {

      getToken.mockReturnValue('fake-token');

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        })
      );

      await expect(createTournament({ name: 'Test' }))
        .rejects
        .toThrow('Failed to create tournament.');
    });

  });

});