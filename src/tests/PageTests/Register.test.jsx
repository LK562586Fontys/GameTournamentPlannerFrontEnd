import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../../Pages/Register';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

import { registerUser } from '../../Services/AuthService';

vi.mock('../../Services/AuthService', () => ({
  registerUser: vi.fn(),
}));


describe('Register page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form inputs', () => {
    render(<Register />);

    expect(screen.getByTestId('register-name')).toBeInTheDocument();
    expect(screen.getByTestId('register-email')).toBeInTheDocument();
    expect(screen.getByTestId('register-password')).toBeInTheDocument();
  });

  test('allows user to type into inputs', async () => {
    render(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('register-name'), 'John');
    await user.type(screen.getByTestId('register-email'), 'john@test.com');
    await user.type(screen.getByTestId('register-password'), '123456');

    expect(screen.getByTestId('register-name')).toHaveValue('John');
    expect(screen.getByTestId('register-email')).toHaveValue('john@test.com');
  });

  test('shows validation error and does not call API', async () => {
    render(<Register />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('register-submit'));

    expect(screen.getByTestId('register-message')).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  test('submits form and shows success message', async () => {
    registerUser.mockResolvedValue({ message: 'User created!' });

    render(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('register-name'), 'John');
    await user.type(screen.getByTestId('register-email'), 'john@test.com');
    await user.type(screen.getByTestId('register-password'), '123456');

    await user.click(screen.getByTestId('register-submit'));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: 'John',
        emailAddress: 'john@test.com',
        password: '123456',
      });

      expect(screen.getByTestId('register-message')).toHaveTextContent(
        'User created!'
      );
    });
  });

  test('handles API error', async () => {
    registerUser.mockRejectedValue(new Error('Server failed'));

    render(<Register />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('register-name'), 'John');
    await user.type(screen.getByTestId('register-email'), 'john@test.com');
    await user.type(screen.getByTestId('register-password'), '123456');

    await user.click(screen.getByTestId('register-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('register-message')).toHaveTextContent(
        'Server failed'
      );
    });
  });
});