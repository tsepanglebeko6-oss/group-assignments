// Verification codes and date helpers.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid misreading

export function makeCode(length = 8) {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  const raw = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

// "ab12cd34" -> "AB12-CD34"
export const normaliseCode = (input) =>
  input.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^(.{4})(.+)$/, "$1-$2");

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

export const formatDateTime = (iso) =>
  iso ? `${formatDate(iso)}, ${new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : "";

export const isExpired = (iso, now = Date.now()) => new Date(iso).getTime() <= now;

export function timeLeft(iso, now = Date.now()) {
  const ms = Math.max(0, new Date(iso).getTime() - now);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${d}d ${h}h ${m}m`;
}
