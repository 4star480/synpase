/** Deterministic online indicator — varies by seller and time of day. */
export function sellerIsOnline(username: string): boolean {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash * 31 + username.charCodeAt(i)) | 0;
  }
  const hour = new Date().getUTCHours();
  return (Math.abs(hash) + hour) % 4 !== 0;
}
