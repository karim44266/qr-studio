# QR Studio

Générateur de QR codes en français, responsive, réalisé avec React, TypeScript et Vite.

## Fonctionnalités

- Texte et URL HTTP(S).
- Wi-Fi : WPA/WPA2, WEP, réseau ouvert, réseau masqué et échappement des caractères spéciaux.
- WhatsApp : numéro international et message prérempli facultatif.
- Prévisualisation instantanée, quatre couleurs et export PNG en 512, 1024 ou 2048 pixels.
- Validation des champs et gestion des contenus trop volumineux.

La génération s'effectue dans le navigateur. Aucun compte, API distante, base de données, outil de suivi ou stockage local des saisies n'est utilisé. Le QR Wi-Fi contient le mot de passe : ne le partagez qu'avec les personnes autorisées.

## Démarrage sur Ubuntu, macOS ou Windows

Prérequis : Node.js 22.13 ou supérieur et npm.

```bash
npm ci
npm run dev
```

Ouvrir l'adresse affichée par Vite. Aucun fichier `.env` ni secret n'est nécessaire.

```bash
npm test           # validation + décodage réel des PNG générés
npm run typecheck  # vérification TypeScript
npm run build      # production dans dist/
npm run preview    # aperçu du build de production
```

## Structure

```text
src/
  App.tsx          Interface et interactions
  main.tsx         Point d'entrée React
  qr-payload.mjs   Validation et construction des contenus QR
  styles.css       Présentation et adaptation mobile
tests/qr.test.mjs   Tests fonctionnels et décodage PNG
.github/workflows/ci.yml  Vérifications à chaque push et pull request
```

## Déploiement

Publier le dossier `dist/` sur un hébergement statique après `npm ci && npm run build`.
Les assets utilisent des chemins relatifs pour permettre l'hébergement sous un sous-répertoire.
Le dossier `.openai/` conserve uniquement la configuration de la démo hébergée ; il n'est pas requis pour exécuter l'application localement.

## Tests et limites

Les tests décodent les PNG avec un lecteur indépendant (jsQR) pour vérifier le texte, l'URL, le Wi-Fi et WhatsApp dans les quatre couleurs et les trois résolutions. Ils couvrent aussi les URL invalides, les caractères spéciaux Wi-Fi et les réseaux ouverts.

Les QR codes sont statiques : modifier leur contenu demande de générer une nouvelle image. Il n'y a ni suivi des scans ni redirection administrable. La validité d'un compte WhatsApp et les identifiants réels d'un réseau ne sont pas vérifiés. Tester aussi le téléchargement et le scan avec les téléphones ciblés avant livraison client.

## Références techniques

- [React](https://react.dev/)
- [Vite](https://vite.dev/guide/)
- [node-qrcode](https://github.com/soldair/node-qrcode)
- [Format Wi-Fi ZXing](https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config-android-ios-11)
- [WhatsApp : click to chat](https://faq.whatsapp.com/5913398998672934)

Aucune licence de redistribution n'est définie pour le code du projet à ce stade. Les dépendances conservent leurs propres licences.
