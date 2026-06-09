import React, { useEffect, useState } from 'react';
import '../index.css';

import {logout} from '../Services/AuthService';

import {
  getAccountById,
  updateProfile,
  updateEmailAddress,
  updatePassword,
} from '../Services/AccountService';

import { validateAccount } from '../Validators/accountValidator';

function Account() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [account, setAccount] = useState(null);

  // Profile fields
  const [name, setName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [country, setCountry] = useState('');
  const [biography, setBiography] = useState('');

  // Email fields
  const [emailAddress, setEmailAddress] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const data = await getAccountById(user.id);

        setAccount(data);

        setName(data.name || '');
        setPronouns(data.pronouns || '');
        setCountry(data.country || '');
        setBiography(data.biography || '');
        setEmailAddress(data.emailAddress || '');
      }
      catch (error) {
        setMessage(error.message);
      }
    };

    loadAccount();
  }, [user.id]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      pronouns,
      country,
      biography,
    };

    const validationError = validateAccount(formData);

    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      await updateProfile(user.id, formData);
      setMessage('Profile updated successfully.');
    }
    catch (error) {
      setMessage(error.message);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateEmailAddress(user.id, { emailAddress });
      setMessage('Email updated successfully.');
    }
    catch (error) {
      setMessage(error.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      await updatePassword(
        user.id,
        {
          currentPassword,
          newPassword
        }
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setMessage('Password updated successfully.');
    }
    catch (error) {
      setMessage(error.message);
    }
  };

    const handleLogout = () => {
        logout();
        setMessage('Logged out successfully.');
        window.location.href = '/login';
    };
  if (!account) {
    return <p>Loading account...</p>;
  }

  return (
    <div className="account-page">

      <h1>My Account</h1>

      {/* Profile Header */}
      <div className="account-header">
        <div className="avatar">
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2>{account.name}</h2>
          <p>{account.emailAddress}</p>
        </div>
      </div>

      {/* Profile Information */}
      <section className="account-section">
        <h3>Profile Information</h3>

        <form onSubmit={handleProfileUpdate}>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Pronouns</label>
          <input
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
          />

          <label>Country</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <label>Biography</label>
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
          />

          <button type="submit">
            Save Profile
          </button>
        </form>
      </section>

      {/* Update Email */}
      <section className="account-section">
        <h3>Update Email</h3>

        <form onSubmit={handleEmailUpdate}>
          <label>Email Address</label>

          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />

          <button type="submit">
            Update Email
          </button>
        </form>
      </section>

      {/* Update Password */}
      <section className="account-section">
        <h3>Update Password</h3>

        <form onSubmit={handlePasswordUpdate}>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
          />

          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <button type="submit">
            Change Password
          </button>
        </form>
      </section>

      {message && (
        <div className="message">
          {message}
        </div>
      )}
      {/* Log Out */}
      <section className="account-section">
        <h3>Log Out</h3>
        <button onClick={handleLogout}>
          Log Out
        </button>
      </section>
    </div>
  );
}

export default Account;