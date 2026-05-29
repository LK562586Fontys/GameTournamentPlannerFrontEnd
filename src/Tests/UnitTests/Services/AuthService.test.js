/// <reference types="vitest" />

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser } from '../../../Services/AuthService';

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

        global.fetch = vi.fn(() =>
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

        global.fetch = vi.fn(() =>
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