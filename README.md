# Chicken Player

Un lecteur vidéo simple et léger multiplateforme qui supporte YouTube, Dailymotion et Vimeo.

![Chicken Player Logo](https://github.com/davidessayan/chicken-player/blob/main/logo.png?raw=true)

## Installation

### Via npm

```bash
npm install chicken-player
```

### Via CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/chicken-player/dist/css/main.css">

<!-- JavaScript -->
<script src="https://unpkg.com/chicken-player/dist/js/main.js"></script>
```

## Utilisation

### Configuration de base

```html
<div class="my-player" data-type="youtube" data-id="VIDEO_ID" id="player-1"></div>
```

### Initialisation

```javascript
import chickenPlayer from 'chicken-player';

// Configuration par défaut
chickenPlayer.init();

// Configuration personnalisée
chickenPlayer.init({
  selector: '.my-player',
  classes: {
    wrapper: 'cbo-chickenplayer',
    cover: 'player-cover',
    button: 'cover-button',
    buttonIcon: 'icon icon-play',
    buttonSpinner: 'button-spinner',
    close: 'player-close',
    statePlaying: 'player--playing',
    stateLoading: 'player--loading',
    stateError: 'player--error'
  },
  picture: {
    src: 'https://placehold.co/600x400',
    width: 600,
    height: 400
  }
});
```

## Support des plateformes

### YouTube

```html
<div class="my-player" data-type="youtube" data-id="VIDEO_ID" id="player-1"></div>
```

### Dailymotion

```html
<div class="my-player" data-type="dailymotion" data-id="VIDEO_ID" id="player-1"></div>
```

### Vimeo

```html
<div class="my-player" data-type="vimeo" data-id="VIDEO_ID" id="player-1"></div>
```

## Événements

Le player émet les événements suivants :

- `chickenPlayer.play` : Émis lorsque la lecture commence
- `chickenPlayer.stop` : Émis lorsque la lecture s'arrête

## Configuration

| Option | Type | Description | Valeur par défaut |
|--------|------|-------------|------------------|
| selector | string | Sélecteur CSS pour les éléments player | '.my-player' |
| classes | object | Classes CSS personnalisables | Voir la documentation |
| picture | object | Configuration de l'image de couverture | Voir la documentation |

## Développement

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm start

# Build en mode développement avec watch
npm run dev

# Build en mode production
npm run build
```

## Licence

ISC 