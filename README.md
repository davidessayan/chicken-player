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
<div class="chicken-player" data-type="youtube" data-id="VIDEO_ID" id="player-1"></div>
```

### Initialisation

```javascript
import ChickenPlayer from 'chicken-player';

// Configuration par défaut
const player = new ChickenPlayer();
player.init();

// Configuration personnalisée
const player = new ChickenPlayer({
  selector: '.chicken-player',
  player: {
    width: 800,
    height: 450,
    youtube: {
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        modestbranding: 1,
        showinfo: 0,
        controls: 1,
        iv_load_policy: 3,
        fs: 1,
        rel: 0,
        loop: 0,
        mute: 0
      }
    },
    vimeo: {
      muted: false,
      loop: false
    },
    dailymotion: {
      playerId: 'yourDailymotionPlayerId',
      params: {
        startTime: 0,
        scaleMode: 'fit',
        loop: false,
        mute: false
      }
    }
  },
  classes: {
    wrapper: 'cbo-chickenplayer',
    cover: 'player-cover',
    button: 'cover-button',
    buttonIcon: 'button-icon',
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
player.init();
```

## Support des plateformes

### YouTube

```html
<div class="chicken-player" data-type="youtube" data-id="VIDEO_ID" id="player-1"></div>
```

### Dailymotion

```html
<div class="chicken-player" data-type="dailymotion" data-id="VIDEO_ID" id="player-1"></div>
```

### Vimeo

```html
<div class="chicken-player" data-type="vimeo" data-id="VIDEO_ID" id="player-1"></div>
```

## Événements

Le player émet les événements suivants :

- `chickenPlayer.play` : Émis lorsque la lecture commence
- `chickenPlayer.stop` : Émis lorsque la lecture s'arrête

## Configuration

| Option | Type | Description | Valeur par défaut |
|--------|------|-------------|------------------|
| selector | string | Sélecteur CSS pour les éléments player | '.chicken-player' |
| player | object | Configuration des players | Voir la documentation |
| classes | object | Classes CSS personnalisables | Voir la documentation |
| picture | object | Configuration de l'image de couverture | Voir la documentation |

### Configuration des players

#### YouTube
- `host` : URL de l'API YouTube
- `playerVars` : Paramètres du player YouTube (voir [documentation YouTube](https://developers.google.com/youtube/player_parameters))

#### Vimeo
- `muted` : Lecture en sourdine
- `loop` : Lecture en boucle

#### Dailymotion
- `playerId` : ID du player
- `params` : Paramètres du player (voir [documentation Dailymotion](https://developers.dailymotion.com/guides/getting-started-with-web-sdk/))

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