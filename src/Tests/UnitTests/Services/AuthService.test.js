/// <reference types="vitest" />

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser, loginUser, getToken, getCurrentUser, logout } from '../../../Services/AuthService.js';

describe('registerUser', () => {

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('should successfully register a user', async () => {

        const mockResponse = {
            id: 1,
            name: 'JPinkman',
            emailAddress: 'test@gmail.com'
        };

        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        );

        const userData = {
            name: 'JPinkman',
            emailAddress: 'test@gmail.com',
            password: 'JPinkman2$'
        };

        const result = await registerUser(userData);

        expect(fetch).toHaveBeenCalledOnce();

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8081/api/accounts',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            }
        );

        expect(result).toEqual(mockResponse);
    });

    it('should throw error when registration fails', async () => {

        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({
                    message: 'Email already exists.'
                })
            })
        );

        const userData = {
            name: 'JPinkman',
            emailAddress: 'test@gmail.com',
            password: 'JPinkman2$'
        };

        await expect(registerUser(userData))
            .rejects
            .toThrow('Email already exists.');
    });
});

describe('loginUser', () => {
  it('logs in successfully and returns sanitized user', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'abc',
        id: 1,
        name: 'John',
        emailAddress: 'john@test.com',
      }),
    });

    const result = await loginUser({ email: 'a', password: 'b' });

    expect(result.token).toBe('abc');
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('throws error when response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Invalid credentials',
      }),
    });

    await expect(loginUser({})).rejects.toThrow('Invalid credentials');
  });

  it('throws default error message if none provided', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(loginUser({})).rejects.toThrow('Login failed.');
  });
});

describe('storage helpers', () => {
  it('getToken returns token from localStorage', () => {
    localStorage.setItem('token', 'abc123');

    expect(getToken()).toBe('abc123');
  });

  it('getCurrentUser parses user JSON', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({ name: 'John' })
    );

    expect(getCurrentUser()).toEqual({ name: 'John' });
  });

  it('logout clears storage', () => {
    localStorage.setItem('token', 'a');
    localStorage.setItem('user', '{}');

    logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});