/// <reference types="vitest" />
import '@testing-library/jest-dom';

import { validateRegister } from '../../../Validators/registerValidator';

describe('validateRegister', () => {
  const createUserData = (overrides = {}) => ({
    name: 'Test User',
    emailAddress: 'test@example.com',
    password: 'password123',
    ...overrides,
  });

  it('should return error if name is empty', () => {
    expect(
      validateRegister(createUserData({ name: '' }))
    ).toBe('Name is required.');
  });

  it('should return error if email is empty', () => {
    expect(
      validateRegister(createUserData({ emailAddress: '' }))
    ).toBe('Email is required.');
  });

  it('should return error if email is invalid', () => {
    expect(
      validateRegister(createUserData({ emailAddress: 'invalid-email' }))
    ).toBe('Invalid email.');
  });

  it('should return error if password is less than 6 characters', () => {
    expect(
      validateRegister(createUserData({ password: 'pass' }))
    ).toBe('Password must be at least 6 characters.');
  });

  it('should return null if all fields are valid', () => {
    expect(
      validateRegister(createUserData())
    ).toBeNull();
  });
});