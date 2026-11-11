import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { Booking } from '../data/bookingBuilder';

export interface CreatedBooking {
  bookingid: number;
  booking: Booking;
}

/** Thin API client for restful-booker. Keeps endpoints & auth out of specs. */
export class BookingClient {
  private token?: string;

  constructor(private readonly request: APIRequestContext) {}

  async authenticate(
    username = process.env.API_USER ?? 'admin',
    password = process.env.API_PASSWORD ?? 'password123',
  ): Promise<string> {
    const res = await this.request.post('/auth', { data: { username, password } });
    expect(res, 'auth call should succeed').toBeOK();
    const body = await res.json();
    expect(body.token, 'auth should return a token').toBeTruthy();
    this.token = body.token as string;
    return this.token;
  }

  private authHeaders(token = this.token): Record<string, string> {
    return token ? { Cookie: `token=${token}` } : {};
  }

  create(booking: Partial<Booking> | Record<string, unknown>): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  async createOk(booking: Booking): Promise<CreatedBooking> {
    const res = await this.create(booking);
    expect(res).toBeOK();
    return (await res.json()) as CreatedBooking;
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  update(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.authHeaders(token) });
  }

  patch(id: number, partial: Partial<Booking>, token?: string): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: partial, headers: this.authHeaders(token) });
  }

  delete(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.authHeaders(token) });
  }
}
