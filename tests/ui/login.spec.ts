import { test, expect } from '../../src/fixtures';
import { users } from '../../src/data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid user lands on inventory @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard);
    await inventoryPage.expectLoaded();
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('locked out user sees lockout error', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut);
    await loginPage.expectError('Sorry, this user has been locked out.');
  });

  test('invalid credentials show generic error', async ({ loginPage }) => {
    await loginPage.login(users.invalid);
    await loginPage.expectError('Username and password do not match');
  });

  const requiredFieldCases = [
    { name: 'empty username', creds: { username: '', password: 'x' }, error: 'Username is required' },
    { name: 'empty password', creds: { username: 'standard_user', password: '' }, error: 'Password is required' },
  ];
  for (const c of requiredFieldCases) {
    test(`validation: ${c.name}`, async ({ loginPage }) => {
      await loginPage.login(c.creds);
      await loginPage.expectError(c.error);
    });
  }

  test('protected page redirects to login when not authenticated', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.expectError(/You can only access '\/inventory.html' when you are logged in/);
  });
});
