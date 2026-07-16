const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/** Short, URL-safe id for a simulated shared-export link. */
export function generateShareId(): string {
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

/** Builds the shareable URL for a given share id, using the current origin when available. */
export function shareUrlFor(shareId: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/shared/${shareId}`;
  }
  return `https://expenzo.app/shared/${shareId}`;
}
