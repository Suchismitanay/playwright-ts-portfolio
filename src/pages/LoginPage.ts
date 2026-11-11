import { Locator, Page, expect } from '@playwright/test';
import { User } from '../data/users';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.error = page.getByTestId('error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.loginButton).toBeVisible();
  }

  async login(user: User): Promise<void> {
    await this.username.fill(user.username);
    await this.password.fill(user.password);
    await this.loginButton.click();
  }

  async expectError(message: string | RegExp): Promise<void> {
    await expect(this.error).toContainText(message);
  }
}
