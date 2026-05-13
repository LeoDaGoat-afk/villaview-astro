// VILLA VIEW Beds24 integration via api-proxy worker.

export const BEDS24_PROXY = 'https://smartinn-api-proxy.leoroy225.workers.dev';

export const VILLA_VIEW_PROPERTY_ID = 322452;
export const VILLA_VIEW_ROOM_ID = 674526;

export type CalendarSegment = {
  from: string;
  to: string;
  numAvail?: number;
  price1?: number | null;
};

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BEDS24_PROXY}/beds24/proxy${path}`);
  if (!res.ok) throw new Error(`Beds24 GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function fetchAvailability(
  roomId: number = VILLA_VIEW_ROOM_ID,
  startDate: string,
  endDate: string
): Promise<CalendarSegment[]> {
  const data = await get<{ data: Array<{ calendar: CalendarSegment[] }> }>(
    `/inventory/rooms/calendar?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}&includeNumAvail=true&includePrices=true`
  );
  return data.data?.[0]?.calendar ?? [];
}

export async function createBooking(payload: {
  arrival: string;
  departure: string;
  numAdult: number;
  numChild?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comments?: string;
  lang?: string;
  price?: number;
  deposit?: number;
}) {
  const body = [
    {
      ...payload,
      propertyId: VILLA_VIEW_PROPERTY_ID,
      roomId: VILLA_VIEW_ROOM_ID,
      offerId: 1,
      status: 'new',
      referer: 'direct',
      channel: 'direct',
      allowWebhooks: 'all',
    },
  ];
  const res = await fetch(`${BEDS24_PROXY}/beds24/proxy/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}
