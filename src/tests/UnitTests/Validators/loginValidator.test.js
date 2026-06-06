/// <reference types="vitest" />
import '@testing-library/jest-dom';

import { validateLogin } from '../../../Validators/loginValidator';

describe('validateLogin', () => {
  const createLoginData = (overrides = {}) => ({
    emailAddress: 'test@example.com',
    password: 'password123',
    ...overrides
  });

  it('should return an error for empty email address', () => {
    expect(
      validateLogin(createLoginData({ emailAddress: '' }))
    ).toBe('Email is required.');
  });

  it('should return an error for empty password', () => {
    expect(
      validateLogin(createLoginData({ password: '' }))
    ).toBe('Password is required.');
  });
});
