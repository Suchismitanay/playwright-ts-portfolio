export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

const isoDate = (offsetDays: number): string => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

/** Builder for unique, valid booking payloads. Pass overrides for edge/negative cases. */
export const buildBooking = (overrides: Partial<Booking> = {}): Booking => {
  const uid = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    firstname: `QA${uid}`,
    lastname: 'Automation',
    totalprice: 1500,
    depositpaid: true,
    bookingdates: { checkin: isoDate(7), checkout: isoDate(10) },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
};
