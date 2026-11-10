import { buildPayload } from "./qr-payload.mjs";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Link,
  Type,
  Wifi,
  MessageCircle,
  Download,
  ArrowUpRight,
  Check,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
const modes = [
  { id: "url", label: "Lien URL", icon: Link },
  { id: "text", label: "Texte", icon: Type },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];
export default function Home() {
  const [mode, setMode] = useState("url"),
    [url, setUrl] = useState("https://example.com"),
    [text, setText] = useState(""),
    [ssid, setSsid] = useState(""),
    [password, setPassword] = useState(""),
    [security, setSecurity] = useState("WPA"),
    [hidden, setHidden] = useState(false),
    [phone, setPhone] = useState(""),
    [message, setMessage] = useState(""),
    [show, setShow] = useState(false),
    [size, setSize] = useState("1024"),
    [color, setColor] = useState("#28213e"),
    [image, setImage] = useState(""),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  const { payload, validation } = buildPayload({
    mode,
    url,
    text,
    ssid,
    password,
    security,
    hidden,
    phone,
    message,
  });
  useEffect(() => {
    let active = true;
    setImage("");
    setDone(false);
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    QRCode.toDataURL(payload, {
      width: Number(size),
      margin: 4,
      errorCorrectionLevel: "M",
      color: { dark: color, light: "#ffffff" },
    })
      .then((data: string) => {
        if (active) setImage(data);
      })
      .catch(() => {
        if (active)
          setError(
            "Ce contenu est trop long. Réduisez-le pour générer le QR code.",
          );
      });
    return () => {
      active = false;
    };
  }, [payload, validation, size, color]);
  function reset() {
    setUrl("");
    setText("");
    setSsid("");
    setPassword("");
    setPhone("");
    setMessage("");
    setHidden(false);
    setSecurity("WPA");
  }
  function download() {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `qr-studio-${mode}-${size}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  }
  return (
    <>
      <header>
        <a className="brand" href="/" aria-label="QR Studio accueil">
          <span className="brand-icon">
            <QrCode size={23} />
          </span>
          qr<span className="brand-light">studio</span>
          <span className="brand-dot">.</span>
        </a>
        <span className="header-note">
          Une idée. Un scan. <ArrowUpRight size={15} />
        </span>
      </header>
      <main>
        <section className="intro">
          <div className="eyebrow">
            <span /> LE LIEN ENTRE VOS IDÉES ET LE MONDE
          </div>
          <h1>
            Petit carré.
            <br />
            Grandes <span>possibilités.</span>
          </h1>
          <p>
            Transformez vos liens, vos mots et vos connexions en QR codes.
            <br className="desktop" /> Simple à créer. Facile à partager.
          </p>
        </section>
        <section className="workspace">
          <div className="editor">
            <div className="section-heading">
              <span className="step">01</span>
              <h2>Composez votre QR code</h2>
            </div>
            <p className="sub">Choisissez ce que vous souhaitez partager.</p>
            <div className="tabs" role="tablist" aria-label="Type de QR code">
              {modes.map((m) => (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={mode === m.id}
                  className={mode === m.id ? "selected" : ""}
                  onClick={() => setMode(m.id)}
                >
                  <m.icon size={19} />
                  {m.label}
                </button>
              ))}
            </div>
            <div className="fields">
              {mode === "url" && (
                <>
                  <label htmlFor="url">Votre lien</label>
                  <div className="input-icon">
                    <Link size={18} />
                    <input
                      id="url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://votre-site.com"
                    />
                  </div>
                  <p className="hint">
                    Un site, un portfolio, une invitation… à vous de choisir.
                  </p>
                </>
              )}
              {mode === "text" && (
                <>
                  <label htmlFor="text">Votre texte</label>
                  <textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Une idée, un message, quelques mots…"
                    maxLength={2000}
                  />
                  <p className="hint">{text.length} / 2 000 caractères</p>
                </>
              )}
              {mode === "wifi" && (
                <>
                  <label htmlFor="ssid">Nom du réseau (SSID)</label>
                  <input
                    id="ssid"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    placeholder="Mon réseau Wi-Fi"
                  />
                  <div className="two-fields">
                    <div>
                      <label htmlFor="security">Sécurité</label>
                      <select
                        id="security"
                        value={security}
                        onChange={(e) => setSecurity(e.target.value)}
                      >
                        <option value="WPA">WPA / WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Sans mot de passe</option>
                      </select>
                    </div>
                    {security !== "nopass" && (
                      <div>
                        <label htmlFor="password">Mot de passe</label>
                        <div className="password">
                          <input
                            id="password"
                            type={show ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mot de passe"
                          />
                          <button
                            onClick={() => setShow(!show)}
                            aria-label={
                              show
                                ? "Masquer le mot de passe"
                                : "Afficher le mot de passe"
                            }
                          >
                            {show ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={hidden}
                      onChange={(e) => setHidden(e.target.checked)}
                    />{" "}
                    Réseau masqué
                  </label>
                  <p className="hint">
                    Toute personne qui scanne ce code pourra accéder au réseau.
                  </p>
                </>
              )}
              {mode === "whatsapp" && (
                <>
                  <label htmlFor="phone">Numéro WhatsApp</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+216 20 123 456"
                  />
                  <p className="hint">
                    Incluez l’indicatif du pays. Le numéro doit utiliser
                    WhatsApp.
                  </p>
                  <label htmlFor="message">
                    Message prérempli{" "}
                    <span className="optional">(facultatif)</span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Bonjour, j’aimerais en savoir plus…"
                    maxLength={1000}
                  />
                </>
              )}
            </div>
            <div className="customize">
              <div className="section-heading">
                <span className="step">02</span>
                <h2>La touche finale</h2>
              </div>
              <div className="options">
                <div>
                  <label>Couleur du code</label>
                  <div className="swatches">
                    {["#28213e", "#6446d4", "#146356", "#1b4c8c"].map((c) => (
                      <button
                        key={c}
                        aria-label={"Couleur " + c}
                        aria-pressed={color === c}
                        onClick={() => setColor(c)}
                        style={{ background: c }}
                      >
                        {color === c && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="size">Résolution PNG</label>
                  <select
                    id="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  >
                    <option value="512">512 × 512 px</option>
                    <option value="1024">1 024 × 1 024 px</option>
                    <option value="2048">2 048 × 2 048 px</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="editor-bottom">
              <span>
                <ShieldCheck size={15} /> Vos données restent dans votre
                navigateur.
              </span>
              <button onClick={reset} aria-label="Effacer les champs">
                <RefreshCw size={14} /> Effacer
              </button>
            </div>
          </div>
          <aside className="preview">
            <div className="preview-top">
              <span>VOTRE QR CODE</span>
              <span className="live">
                <span /> Aperçu en direct
              </span>
            </div>
            <div className="qr-stage">
              <div className="qr-paper">
                {image ? (
                  <img
                    src={image}
                    alt={`QR code ${modes.find((m) => m.id === mode)?.label}`}
                    width="248"
                    height="248"
                  />
                ) : (
                  <div className="empty">
                    <QrCode size={64} strokeWidth={1} />
                    <p>
                      Votre QR code
                      <br />
                      apparaîtra ici
                    </p>
                  </div>
                )}
              </div>
              <span className="orbit orbit-one" />
              <span className="orbit orbit-two" />
            </div>
            <div className="preview-caption">
              <h3>
                {image
                  ? "Prêt pour le prochain scan."
                  : "Tout commence par une idée."}
              </h3>
              <p aria-live="polite">
                {error || "Scannez, partagez, connectez."}
              </p>
            </div>
            <button className="download" onClick={download} disabled={!image}>
              {done ? <Check size={19} /> : <Download size={19} />}{" "}
              {done ? "PNG téléchargé" : "Télécharger le PNG"}
              <span>↗</span>
            </button>
            <p className="export-note">
              PNG haute qualité · Fond blanc · Sans filigrane
            </p>
          </aside>
        </section>
        <section className="benefits">
          <div>
            <span>↗</span>
            <p>
              <strong>Du contenu à la connexion</strong>Quatre façons de
              partager, un seul outil.
            </p>
          </div>
          <div>
            <ShieldCheck size={24} />
            <p>
              <strong>Simplement privé</strong>Aucun compte. Aucune donnée
              enregistrée.
            </p>
          </div>
          <div>
            <QrCode size={24} />
            <p>
              <strong>À l’écran comme sur papier</strong>Des QR codes prêts à
              vous suivre partout.
            </p>
          </div>
        </section>
        <footer>
          <span>
            qrstudio. <span>Le partage, en plus simple.</span>
          </span>
          <span>Créé avec soin, pour vos idées.</span>
        </footer>
      </main>
    </>
  );
}
