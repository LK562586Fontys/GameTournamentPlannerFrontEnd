import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

vi.mock('../../Validators/loginValidator', () => ({
  validateLogin: vi.fn(),
}));

vi.mock('../../Services/AuthService', () => ({
  loginUser: vi.fn(),
}));

import { validateLogin } from '../../Validators/loginValidator';
import { loginUser } from '../../Services/AuthService';
import Login from '../../Pages/Login';

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('renders inputs and button', () => {
    render(<Login />);

    expect(screen.getByTestId('login-email')).toBeInTheDocument();
    expect(screen.getByTestId('login-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit')).toBeInTheDocument();
  });

  test('allows typing into fields', async () => {
    const user = userEvent.setup();

    render(<Login />);

    await user.type(screen.getByTestId('login-email'), 'john@test.com');
    await user.type(screen.getByTestId('login-password'), '123456');

    expect(screen.getByTestId('login-email')).toHaveValue('john@test.com');
    expect(screen.getByTestId('login-password')).toHaveValue('123456');
  });

  test('shows validation error', async () => {
    validateLogin.mockReturnValue('Email is required');

    const user = userEvent.setup();

    render(<Login />);

    await user.click(screen.getByTestId('login-submit'));

    expect(screen.getByTestId('login-message'))
      .toHaveTextContent('Email is required');

    expect(loginUser).not.toHaveBeenCalled();
  });

  test('logs in successfully', async () => {
    validateLogin.mockReturnValue(null);

    loginUser.mockResolvedValue({
      token: 'token123',
      id: 1,
      name: 'John',
      emailAddress: 'john@test.com',
    });

    const user = userEvent.setup();

    render(<Login />);

    await user.type(screen.getByTestId('login-email'), 'john@test.com');
    await user.type(screen.getByTestId('login-password'), '123456');

    await user.click(screen.getByTestId('login-submit'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        emailAddress: 'john@test.com',
        password: '123456',
      });
    });

    expect(localStorage.getItem('token')).toBe('token123');

    expect(screen.getByTestId('login-message'))
      .toHaveTextContent('Login successful!');
  });

  test('handles api error', async () => {
    validateLogin.mockReturnValue(null);

    loginUser.mockRejectedValue(
      new Error('Invalid credentials')
    );

    const user = userEvent.setup();

    render(<Login />);

    await user.type(screen.getByTestId('login-email'), 'john@test.com');
    await user.type(screen.getByTestId('login-password'), 'wrongpass');

    await user.click(screen.getByTestId('login-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('login-message'))
        .toHaveTextContent('Invalid credentials');
    });
  });
});