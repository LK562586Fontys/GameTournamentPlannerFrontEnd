/// <reference types="vitest" />
import '@testing-library/jest-dom'

import { validateRegister } from '../../../Validators/registerValidator';

describe('validateRegister', () => {
    it('should return error if name is empty', () => {
        const userData = {
            name: '',
            emailAddress: 'test@example.com',
            password: 'password123'
        };

        const result = validateRegister(userData);

        expect(result).toBe("Name is required.");
    });
 });

    describe('validateRegister', () => {
        it('should return error if email is empty', () => {
            const userData = {
                name: 'Test User',
                emailAddress: '',
                password: 'password123'
            };
            const result = validateRegister(userData);

            expect(result).toBe("Email is required.");
        }
    );
});

describe('validateRegister', () => {
    it('should return error if email is invalid', () => {
        const userData = {
            name: 'Test User',
            emailAddress: 'invalid-email',
            password: 'password123'
        };
        const result = validateRegister(userData);
        expect(result).toBe("Invalid email.");
    });
});

describe('validateRegister', () => {
    it('should return error if password is less than 6 characters', () => {
        const userData = {
            name: 'Test User',
            emailAddress: 'test@example.com',
            password: 'pass'
        };
        const result = validateRegister(userData);
        expect(result).toBe("Password must be at least 6 characters.");
    });
});

describe('validateRegister', () => {
    it('should return null if all fields are valid', () => {
        const userData = {
            name: 'Test User',
            emailAddress: 'test@example.com',
            password: 'password123'
        };
        const result = validateRegister(userData);
        expect(result).toBeNull();
    });
});