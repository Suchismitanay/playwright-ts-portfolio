import { Locator, Page, expect } from '@playwright/test';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly itemTotal: Locator;
  readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.itemTotal = page.getByTestId('subtotal-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInfo(info: CustomerInfo): Promise<void> {
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  async subtotal(): Promise<number> {
    const text = (await this.itemTotal.textContent()) ?? '';
    return Number(text.replace(/[^0-9.]/g, ''));
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
