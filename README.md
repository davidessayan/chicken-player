# Chicken Player

![Chicken Player Logo](https://github.com/davidessayan/chicken-player/blob/main/logo.png?raw=true)

Un plugin JavaScript léger et flexible pour l'intégration de vidéos YouTube, Vimeo, Dailymotion et HTML5 dans vos projets web.

## Installation

### Via NPM

```bash
npm install chicken-player
```

### Via CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/chicken-player/dist/chicken-player.css">

<!-- JavaScript -->
<script src="https://unpkg.com/chicken-player/dist/chicken-player.umd.js"></script>
```

## Utilisation

### Exemple basique

```html
<!-- HTML -->
<div class="chicken-player" data-type="youtube" data-id="VIDEO_ID"></div>

<!-- JavaScript -->
<script>
  const player = new ChickenPlayer();
</script>
```

### Exemple avec configuration personnalisée

```html
<!-- HTML -->
<div class="chicken-player" data-type="vimeo" data-id="VIDEO_ID"></div>

<!-- JavaScript -->
<script>
  const player = new ChickenPlayer({
    selector: '.chicken-player',
    player: {
      width: 800,
      height: 450,
      vimeo: {
        muted: true,
        loop: true
      }
    },
    picture: {
      src: 'path/to/thumbnail.jpg',
      width: 800,
      height: 450
    }
  });
</script>
```

## Configuration

### Options principales

| Option | Type | Description | Par défaut |
|--------|------|-------------|------------|
| `selector` | string | Sélecteur CSS pour les éléments player | `.chicken-player` |
| `player.width` | number | Largeur du player | 600 |
| `player.height` | number | Hauteur du player | 400 |
| `classes.wrapper` | string | Classe CSS du wrapper | `cbo-chickenplayer` |
| `classes.cover` | string | Classe CSS de la couverture | `player-cover` |
| `classes.button` | string | Classe CSS du bouton | `cover-button` |
| `classes.buttonIcon` | string | Classe CSS de l'icône du bouton | `button-icon` |
| `classes.buttonSpinner` | string | Classe CSS du spinner | `button-spinner` |
| `classes.close` | string | Classe CSS du bouton de fermeture | `player-close` |
| `classes.statePlaying` | string | Classe CSS de l'état lecture | `player--playing` |
| `classes.stateLoading` | string | Classe CSS de l'état chargement | `player--loading` |
| `classes.stateError` | string | Classe CSS de l'état erreur | `player--error` |
| `classes.stateReady` | string | Classe CSS de l'état prêt | `player--ready` |
| `picture.src` | string | URL de l'image de couverture | `https://placehold.co/600x400` |
| `picture.width` | number | Largeur de l'image de couverture | 600 |
| `picture.height` | number | Hauteur de l'image de couverture | 400 |

### Options spécifiques par plateforme

#### YouTube
```javascript
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
}
```

#### Vimeo
```javascript
vimeo: {
  muted: false,
  loop: false
}
```

#### Dailymotion
```javascript
dailymotion: {
  playerId: null,
  params: {
    startTime: 0,
    scaleMode: 'fit',
    loop: false,
    mute: false
  }
}
```

#### HTML5
```javascript
html5: {
  controls: true,
  preload: 'metadata',
  playsinline: true
}
```

## API

### Événements

Le player émet deux événements personnalisés :
- `chickenPlayer.play` : Émis lorsque la lecture commence
- `chickenPlayer.stop` : Émis lorsque la lecture s'arrête

## Licence

GNU GPL v3 © David Essayan

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.