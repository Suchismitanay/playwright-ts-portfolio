import { test, expect } from '../../src/fixtures';
import { buildBooking } from '../../src/data/bookingBuilder';

test.describe('Booking API', () => {
  test('health check @smoke', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('create → get returns the same booking @smoke', async ({ bookingApi }) => {
    const payload = buildBooking();
    const { bookingid, booking } = await bookingApi.createOk(payload);
    expect(bookingid).toBeGreaterThan(0);
    expect(booking).toEqual(payload);

    const res = await bookingApi.get(bookingid);
    expect(res).toBeOK();
    expect(await res.json()).toEqual(payload);
  });

  test('full update with valid token', async ({ bookingApi }) => {
    const { bookingid } = await bookingApi.createOk(buildBooking());
    await bookingApi.authenticate();
    const updated = buildBooking({ totalprice: 2500, depositpaid: false });

    const res = await bookingApi.update(bookingid, updated);
    expect(res).toBeOK();
    expect(await res.json()).toEqual(updated);
  });

  test('partial update changes only given fields', async ({ bookingApi }) => {
    const original = buildBooking();
    const { bookingid } = await bookingApi.createOk(original);
    await bookingApi.authenticate();

    const res = await bookingApi.patch(bookingid, { additionalneeds: 'Late checkout' });
    expect(res).toBeOK();
    expect(await res.json()).toEqual({ ...original, additionalneeds: 'Late checkout' });
  });

  test('delete removes booking', async ({ bookingApi }) => {
    const { bookingid } = await bookingApi.createOk(buildBooking());
    await bookingApi.authenticate();

    expect((await bookingApi.delete(bookingid)).status()).toBe(201); // restful-booker returns 201 on delete
    expect((await bookingApi.get(bookingid)).status()).toBe(404);
  });

  test.describe('negative', () => {
    test('update without token is forbidden', async ({ bookingApi }) => {
      const { bookingid } = await bookingApi.createOk(buildBooking());
      const res = await bookingApi.update(bookingid, buildBooking());
      expect(res.status()).toBe(403);
    });

    test('delete with invalid token is forbidden', async ({ bookingApi }) => {
      const { bookingid } = await bookingApi.createOk(buildBooking());
      const res = await bookingApi.delete(bookingid, 'invalid-token');
      expect(res.status()).toBe(403);
    });

    test('auth with wrong password returns no token', async ({ request }) => {
      const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
      expect(res).toBeOK(); // API quirk: 200 with error body
      expect(await res.json()).toEqual({ reason: 'Bad credentials' });
    });

    test('get non-existent booking returns 404', async ({ bookingApi }) => {
      expect((await bookingApi.get(999999999)).status()).toBe(404);
    });

    test('create with missing required fields is rejected', async ({ bookingApi }) => {
      const res = await bookingApi.create({ firstname: 'OnlyFirstName' });
      expect(res.ok()).toBeFalsy();
    });
  });
});
