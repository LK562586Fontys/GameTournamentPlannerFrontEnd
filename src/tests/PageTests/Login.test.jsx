import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

vi.mock('../../Services/AuthService', () => ({
  loginUser: vi.fn(),
}));

import { loginUser } from '../../Services/AuthService';
import Login from '../../Pages/Login';

describe('Login page', () => {
  test('renders form inputs', () => {
    render(<Login />);

    expect(screen.getByTestId('login-email')).toBeInTheDocument();
    expect(screen.getByTestId('login-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit')).toBeInTheDocument();
  });

  test('allows user to type into inputs', async () => {
    const user = userEvent.setup();

    render(<Login />);

    await user.type(
      screen.getByTestId('login-email'),
      'john@test.com'
    );

    await user.type(
      screen.getByTestId('login-password'),
      'password123'
    );

    expect(screen.getByTestId('login-email'))
      .toHaveValue('john@test.com');

    expect(screen.getByTestId('login-password'))
      .toHaveValue('password123');
  });

  test('shows validation error when fields are empty', async () => {
    const user = userEvent.setup();

    render(<Login />);

    await user.click(
      screen.getByTestId('login-submit')
    );

    expect(loginUser).not.toHaveBeenCalled();

    expect(
      screen.getByTestId('login-message')
    ).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    loginUser.mockResolvedValue({
      token: 'abc123',
    });

    const user = userEvent.setup();

    render(<Login />);

    await user.type(
      screen.getByTestId('login-email'),
      'john@test.com'
    );

    await user.type(
      screen.getByTestId('login-password'),
      'password123'
    );

    await user.click(
      screen.getByTestId('login-submit')
    );

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        emailAddress: 'john@test.com',
        password: 'password123',
      });
    });
  });

  test('handles login failure', async () => {
    loginUser.mockRejectedValue(
      new Error('Invalid credentials')
    );

    const user = userEvent.setup();

    render(<Login />);

    await user.type(
      screen.getByTestId('login-email'),
      'john@test.com'
    );

    await user.type(
      screen.getByTestId('login-password'),
      'wrongpassword'
    );

    await user.click(
      screen.getByTestId('login-submit')
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('login-message')
      ).toBeInTheDocument();
    });
  });
});