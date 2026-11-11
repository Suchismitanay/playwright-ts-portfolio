import { test, expect } from '../../src/fixtures';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Cart & checkout', () => {
  test('end-to-end purchase of two items @smoke', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart(BACKPACK, BIKE_LIGHT);
    await expect(loggedIn.cartBadge).toHaveText('2');

    await loggedIn.openCart();
    await cartPage.expectItems([BACKPACK, BIKE_LIGHT]);
    await cartPage.checkout();

    await checkoutPage.fillInfo({ firstName: 'Suchi', lastName: 'QA', postalCode: '122003' });
    expect(await checkoutPage.subtotal()).toBeCloseTo(29.99 + 9.99, 2);
    await checkoutPage.finish();
  });

  test('removing an item updates the cart badge', async ({ loggedIn }) => {
    await loggedIn.addToCart(BACKPACK, BIKE_LIGHT);
    await loggedIn.removeFromCart(BACKPACK);
    await expect(loggedIn.cartBadge).toHaveText('1');
    await loggedIn.removeFromCart(BIKE_LIGHT);
    await expect(loggedIn.cartBadge).toBeHidden();
  });

  test('checkout requires customer info', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo({ firstName: '', lastName: '', postalCode: '' });
    await expect(checkoutPage.error).toContainText('First Name is required');
  });

  test('sort by price low → high', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by name Z → A', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    const names = await loggedIn.names();
    expect(names).toEqual([...names].sort().reverse());
  });
});
