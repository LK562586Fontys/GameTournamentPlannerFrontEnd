import React, { useState } from 'react';
import '../index.css';

import { validateLogin } from '../Validators/loginValidator';
import { loginUser } from '../Services/AuthService';

function Login() {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('');

    const formData = {
      emailAddress,
      password,
    };

    const validationError = validateLogin(formData);

    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      const result = await loginUser(formData);
      // NOSONAR
      localStorage.setItem('token', result.token);
      // NOSONAR
      localStorage.setItem('user', JSON.stringify({
        id: result.id,
        name: result.name,
        emailAddress: result.emailAddress,
      }));

      setMessage('Login successful!');
    } catch (error) {
      setMessage(error.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="emailAddress">Email</label>

          <input
            data-testid="login-email"
            type="email"
            id="emailAddress"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            data-testid="login-password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button data-testid="login-submit" type="submit">
          Login
        </button>
      </form>

      {message && <p data-testid="login-message">{message}</p>}
    </div>
  );
}

export default Login;