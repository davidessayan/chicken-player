# 🐔 Chicken Player

> Un player vidéo qui ne pond pas de problèmes.

Une lib JavaScript légère, sans dépendances, framework-agnostic, pour intégrer YouTube, Vimeo, Dailymotion et HTML5 dans vos projets web.

[![npm](https://img.shields.io/npm/v/chicken-player)](https://www.npmjs.com/package/chicken-player)
[![license](https://img.shields.io/npm/l/chicken-player)](./LICENSE)

[📖 Documentation](https://chickenplayer.creative-bones.com/docs) · [🛝 Playground](https://chickenplayer.creative-bones.com)

---

## Pourquoi ?

Parce que les players vidéo, c'est souvent lourd, opaque, et difficile à brancher sur un système de consentement.

`chicken-player` est léger, zéro dépendance runtime, 100% CSS pour le sizing, et s'intègre naturellement avec n'importe quel gestionnaire de consentement (ou avec [tarte-aux-etrons](https://www.npmjs.com/package/tarte-aux-etrons) 💩).

---

## Installation

```bash
npm install chicken-player
# ou
pnpm add chicken-player
# ou
yarn add chicken-player
```

```js
import ChickenPlayer from 'chicken-player';
import 'chicken-player/style';
```

### Via CDN

```html
<link rel="stylesheet" href="https://unpkg.com/chicken-player/dist/chicken-player.css">
<script src="https://unpkg.com/chicken-player/dist/chicken-player.umd.js"></script>
```

---

## Démarrage rapide

```html
<div class="chicken-player" data-type="youtube" data-id="dQw4w9WgXcQ"></div>

<script>
  const player = new ChickenPlayer();
</script>
```

C'est tout. Le player 🐔 s'affiche, la miniature est chargée, la vidéo se lit au clic.

---

## Plateformes supportées

| Plateforme | `data-type` | `data-id` |
|---|---|---|
| YouTube | `youtube` | ID de la vidéo (`dQw4w9WgXcQ`) |
| Vimeo | `vimeo` | ID de la vidéo (`123456789`) |
| Dailymotion | `dailymotion` | ID de la vidéo (`x9k8k0y`) |
| HTML5 | `html5` | URL du fichier vidéo |

---

## Image de couverture

Trois façons de définir la miniature affichée avant lecture :

### Méthode 1 — Image dans le HTML (prioritaire)

```html
<div class="chicken-player" data-type="youtube" data-id="dQw4w9WgXcQ">
  <img src="ma-miniature.jpg" alt="Ma vidéo">
</div>
```

### Méthode 2 — Image par défaut globale

```js
const player = new ChickenPlayer({
  picture: {
    src: 'https://example.com/thumbnail.jpg',
    width: 600,
    height: 400,
  },
});
```

### Méthode 3 — Désactiver les miniatures

```js
const player = new ChickenPlayer({ picture: false });
```

**Priorité :** HTML > config > aucune image.

---

## Apparence & Dimensions

L'intégralité de l'apparence est contrôlée par CSS. Pour modifier les dimensions, surchargez `.cbo-chickenplayer` :

```css
.cbo-chickenplayer {
  padding-bottom: 56.25%; /* ratio 16:9 par défaut */
}
```

---

## Configuration

### Options principales

| Option | Type | Défaut | Description |
|---|---|---|---|
| `selector` | string | `.chicken-player` | Sélecteur CSS des éléments player |
| `picture` | boolean\|object | `{src, width, height}` | Config de la miniature. `false` pour désactiver |
| `picture.src` | string | placeholder CDN | URL de l'image par défaut |
| `a11y.playLabel` | string | `'Lire la vidéo'` | `aria-label` du bouton Play |
| `a11y.closeLabel` | string | `'Fermer la vidéo'` | `aria-label` du bouton Close |

### Options par plateforme

#### YouTube

```js
youtube: {
  host: 'https://www.youtube-nocookie.com',
  playerVars: { modestbranding: 1, controls: 1, rel: 0, loop: 0, mute: 0 },
}
```

#### Vimeo

```js
vimeo: { muted: false, loop: false }
```

#### Dailymotion

```js
dailymotion: {
  playerId: null,
  params: { startTime: 0, scaleMode: 'fit', loop: false, mute: false },
}
```

#### HTML5

```js
html5: {
  controls: true, preload: 'auto', autoplay: false, loop: false,
  muted: false, poster: '', width: 'auto', height: 'auto',
}
```

---

## API JavaScript

### `play(selector?)`

Lance la lecture de tous les players ou d'un player ciblé.

```js
player.play();                    // tous les players
player.play('#mon-player');       // un player spécifique
player.play('.youtube-player');   // par sélecteur CSS
```

### `stop(selector?)`

Arrête tous les players ou un player ciblé.

```js
player.stop();
player.stop('#mon-player');
```

---

## Événements de lecture

```js
// Émis quand la lecture commence
window.addEventListener('chickenPlayer.play', (e) => { /* ... */ });

// Émis quand la lecture s'arrête
window.addEventListener('chickenPlayer.stop', (e) => { /* ... */ });
```

---

## Gestion du consentement

Le player peut attendre le consentement avant de charger la vidéo. Compatible avec n'importe quel gestionnaire de cookies.

### Configuration globale

```js
const player = new ChickenPlayer({
  cookies: {
    active: true,
    message: 'Acceptez les cookies pour voir cette vidéo.',
    eventConsent: 'chickenPlayer.cookies.consent',
    eventReject: 'chickenPlayer.cookies.reject',
    types: ['youtube', 'vimeo', 'dailymotion'],
  },
});
```

### Déclencher le consentement

```js
// Consentement accordé
window.dispatchEvent(new Event('chickenPlayer.cookies.consent'));

// Consentement refusé
window.dispatchEvent(new Event('chickenPlayer.cookies.reject'));
```

### Avec tarte-aux-etrons

```js
import { createTaE, youtube } from 'tarte-aux-etrons';

createTaE({ services: [youtube()] });

// tarte-aux-etrons émet ses propres événements — câblez-les avec cookies.eventConsent
```

### Options de consentement

| Option | Type | Défaut | Description |
|---|---|---|---|
| `cookies.active` | boolean | `false` | Active la gestion du consentement |
| `cookies.message` | string | `'Pour regarder...'` | Message affiché en attente de consentement |
| `cookies.eventConsent` | string | `'chickenPlayer.cookies.consent'` | Événement de consentement |
| `cookies.eventReject` | string | `'chickenPlayer.cookies.reject'` | Événement de refus |
| `cookies.types` | array | `['youtube', 'dailymotion', 'vimeo']` | Plateformes concernées |

---

## Accessibilité

Les boutons Play et Close exposent un `aria-label` personnalisable :

```js
const player = new ChickenPlayer({
  a11y: {
    playLabel: 'Play video',
    closeLabel: 'Close video',
  },
});
```

---

## Roadmap

- Mode playlist (enchaînement automatique)
- Support Twitch
- Événements par instance de player

---

## Licence

GNU GPL v3 © David Essayan
