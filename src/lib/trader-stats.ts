/** Deterministic demo sales count (1000–3000) from username. */
export function salesCountForUsername(username: string): number {
  let h = 0;
  for (let i = 0; i < username.length; i++) {
    h = (h * 31 + username.charCodeAt(i)) | 0;
  }
  return 1000 + (Math.abs(h) % 2001);
}

/** Deterministic member-since date in 2014–2016 from username. */
export function memberSinceForUsername(username: string): Date {
  let h = 0;
  for (let i = 0; i < username.length; i++) {
    h = (h * 31 + username.charCodeAt(i)) | 0;
  }
  const year = 2014 + (Math.abs(h) % 3);
  const month = Math.abs(h >> 8) % 12;
  const day = 1 + (Math.abs(h >> 16) % 28);
  return new Date(year, month, day);
}

export function displaySalesCount(stored: number, completedOrders: number): number {
  return stored + completedOrders;
}
