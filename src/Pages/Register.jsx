import React, { useState } from 'react';
import '../index.css';

import { validateRegister } from '../Validators/registerValidator';
import { registerUser } from '../Services/AuthService';

function Register() {
  const [name, setName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('');

    const formData = {
      name,
      emailAddress,
      password,
    };

    const validationError = validateRegister(formData);

    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      const result = await registerUser(formData);

      setMessage(result.message || 'Registration successful!');

      setName('');
      setEmailAddress('');
      setPassword('');
    } catch (error) {
      setMessage(error.message);
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>

          <input
            data-testid="register-name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="emailAddress">Email</label>

          <input
            data-testid="register-email"
            type="email"
            id="emailAddress"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            data-testid="register-password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button data-testid="register-submit" type="submit">Register</button>
      </form>

      {message && <p data-testid="register-message">{message}</p>}
    </div>
  );
}

export default Register;