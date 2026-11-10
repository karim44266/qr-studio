import test from "node:test";
import assert from "node:assert/strict";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { PNG } from "pngjs";
import { buildPayload } from "../src/qr-payload.mjs";
test("URL: reject unsafe protocols and empty values", () => {
  for (const url of ["", "invalid", "javascript:alert(1)", "ftp://example.com"])
    assert.ok(buildPayload({ mode: "url", url }).validation);
  assert.equal(
    buildPayload({ mode: "url", url: "https://example.com" }).payload,
    "https://example.com/",
  );
});
test("Wi-Fi: escape reserved characters and preserve Unicode", () => {
  assert.equal(
    buildPayload({
      mode: "wifi",
      ssid: "Café;A",
      password: "x:y\\z",
      hidden: true,
    }).payload,
    "WIFI:T:WPA;S:Café\\;A;P:x\\:y\\\\z;H:true;;",
  );
});
test("Open Wi-Fi must never include a leftover password", () => {
  assert.equal(
    buildPayload({
      mode: "wifi",
      ssid: "Guest",
      password: "old-secret",
      security: "nopass",
    }).payload,
    "WIFI:T:nopass;S:Guest;P:;H:false;;",
  );
});
test("WhatsApp: normalize international number and encode message", () => {
  assert.equal(
    buildPayload({
      mode: "whatsapp",
      phone: "+216 20 123 456",
      message: "Bonjour & merci",
    }).payload,
    "https://wa.me/21620123456?text=Bonjour%20%26%20merci",
  );
  assert.ok(buildPayload({ mode: "whatsapp", phone: "abc" }).validation);
});
test("Blank text and protected Wi-Fi without password are invalid", () => {
  assert.ok(buildPayload({ mode: "text", text: "  " }).validation);
  assert.ok(buildPayload({ mode: "wifi", ssid: "Private" }).validation);
});
test("PNG round trip: all modes, supported colors and resolutions", async () => {
  const inputs = [
    { mode: "url", url: "https://example.com" },
    { mode: "text", text: "Bonjour Karim — مرحبا !" },
    { mode: "wifi", ssid: "Café;Test", password: "demo:12345" },
    { mode: "whatsapp", phone: "+21620123456", message: "Bonjour !" },
  ];
  for (const input of inputs) {
    const { payload, validation } = buildPayload(input);
    assert.equal(validation, "");
    for (const width of [512, 1024, 2048])
      for (const dark of ["#28213e", "#6446d4", "#146356", "#1b4c8c"]) {
        const buffer = await QRCode.toBuffer(payload, {
          width,
          margin: 4,
          errorCorrectionLevel: "M",
          color: { dark, light: "#ffffff" },
        });
        const png = PNG.sync.read(buffer);
        assert.equal(png.width, width);
        assert.equal(png.height, width);
        assert.equal(
          jsQR(new Uint8ClampedArray(png.data), width, width)?.data,
          payload,
        );
      }
  }
});
