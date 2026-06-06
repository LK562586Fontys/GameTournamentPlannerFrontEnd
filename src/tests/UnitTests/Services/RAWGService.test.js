/// <reference types="vitest" />

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchGames, getGameDetails } from '../../../Services/RAWGService.js';

describe('RAWGService', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchGames', () => {

    it('should return empty array when query is empty', async () => {

      const result = await searchGames('');

      expect(result).toEqual([]);
    });

    it('should successfully search games', async () => {

      const mockResponse = {
        results: [
          { id: 1, name: 'Witcher 3' },
          { id: 2, name: 'Skyrim' }
        ]
      };

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
      );

      const result = await searchGames('witcher');

      expect(fetch).toHaveBeenCalledOnce();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=witcher')
      );

      expect(result).toEqual(mockResponse.results);
    });

    it('should throw error when search fails', async () => {

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        })
      );

      await expect(searchGames('witcher'))
        .rejects
        .toThrow('Failed to search games.');
    });

  });

  describe('getGameDetails', () => {

    it('should throw error for invalid game id (non-number)', async () => {

      await expect(getGameDetails('abc'))
        .rejects
        .toThrow('Invalid game id.');
    });

    it('should throw error for invalid game id (zero or negative)', async () => {

      await expect(getGameDetails(0))
        .rejects
        .toThrow('Invalid game id.');
    });

    it('should successfully fetch game details', async () => {

      const mockResponse = {
        id: 1,
        name: 'Witcher 3'
      };

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
      );

      const result = await getGameDetails(1);

      expect(fetch).toHaveBeenCalledOnce();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/1?key=')
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetching game details fails', async () => {

      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        })
      );

      await expect(getGameDetails(1))
        .rejects
        .toThrow('Failed to get game details.');
    });

  });

});