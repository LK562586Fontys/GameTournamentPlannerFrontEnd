/// <reference types="vitest" />

import { test, expect } from '@playwright/test';

test('user can register successfully', async ({ page }) => {
  // generate unique email
  const email = `john${Date.now()}@example.com`;
  const username = `John Doe ${Date.now()}`;

  // open page
  await page.goto('/register');

  // fill form
  await page.getByTestId('register-name')
    .fill(username);

  await page.getByTestId('register-email')
    .fill(email);

  await page.getByTestId('register-password')
    .fill('password123');

  // submit form
  await page.getByTestId('register-submit')
    .click();

  // verify success message
  await expect(
    page.getByTestId('register-message')
  ).toContainText('Registration successful');
});