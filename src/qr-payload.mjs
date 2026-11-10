export const escapeWifi = (value) => value.replace(/[\\;,:\"]/g, "\\$&");
export function buildPayload({
  mode,
  url = "",
  text = "",
  ssid = "",
  password = "",
  security = "WPA",
  hidden = false,
  phone = "",
  message = "",
}) {
  let payload = "",
    validation = "";
  if (mode === "url") {
    try {
      const u = new URL(url);
      if (!["http:", "https:"].includes(u.protocol)) throw Error();
      payload = u.href;
    } catch {
      validation = url
        ? "Saisissez une URL valide commençant par https:// ou http://."
        : "Ajoutez un lien pour créer votre QR code.";
    }
  } else if (mode === "text") {
    payload = text;
    if (!text.trim())
      validation = "Ajoutez votre texte pour créer votre QR code.";
  } else if (mode === "wifi") {
    if (!ssid.trim()) validation = "Indiquez le nom de votre réseau Wi-Fi.";
    else if (security !== "nopass" && !password)
      validation = "Indiquez le mot de passe du réseau.";
    else
      payload = `WIFI:T:${security};S:${escapeWifi(ssid)};P:${security === "nopass" ? "" : escapeWifi(password)};H:${hidden};;`;
  } else if (mode === "whatsapp") {
    const number = phone.replace(/[\s()+.-]/g, "");
    if (!/^[1-9]\d{6,14}$/.test(number))
      validation =
        "Saisissez un numéro international, par exemple +216 20 123 456.";
    else
      payload = `https://wa.me/${number}${message ? "?text=" + encodeURIComponent(message) : ""}`;
  } else validation = "Type de QR code inconnu.";
  return { payload, validation };
}
