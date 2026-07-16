/** Render a URL as a QR code data URL (PNG), sized for inline display. */
export async function buildQrDataUrl(text: string): Promise<string> {
  const QRCode = await import("qrcode");
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 240,
    color: { dark: "#3730a3", light: "#ffffff" },
  });
}
