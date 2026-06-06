import { sanitizeUser } from '../../../Services/sanitizeUser.js';

describe('sanitizeUser', () => {
  it('returns sanitized frozen user object', () => {
    const input = {
      token: ' abc123 ',
      id: 1,
      name: ' John Doe ',
      emailAddress: ' TEST@EMAIL.COM ',
    };

    const result = sanitizeUser(input);

    expect(result).toEqual({
      token: 'abc123',
      id: 1,
      name: 'John Doe',
      emailAddress: 'test@email.com',
    });

    expect(Object.isFrozen(result)).toBe(true);
  });

  it('throws error for invalid user object', () => {
    expect(() =>
      sanitizeUser({ token: 123 })
    ).toThrow('Invalid user object');
  });
});