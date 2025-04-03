import chickenDailymotion from './chicken-dailymotion';
import chickenYoutube from './chicken-youtube';
import chickenVimeo from './chicken-vimeo';

const chickenPlayer = {
  config: {
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
      height: 400,
    },
    events: {
      play: new Event('chickenPlayer.play'),
      stop: new Event('chickenPlayer.stop'),
    }
  },

  init: function (opts = {}) {
    // Merge opts and config
    this.config = this.mergeConfig(this.config, opts);

    document.querySelectorAll(this.config.selector).forEach(el => {
      const markup = this.markup(el);
      el.parentNode.replaceChild(markup, el);
    });

    this.bind();
  },

  // Helper function to deep merge config objects
  mergeConfig: function (defaultConfig, userConfig) {
    const merged = { ...defaultConfig };

    for (const key in userConfig) {
      if (userConfig.hasOwnProperty(key)) {
        // If both objects have the same key and both values are objects, merge them
        if (
          typeof userConfig[key] === 'object' &&
          userConfig[key] !== null &&
          typeof defaultConfig[key] === 'object' &&
          defaultConfig[key] !== null
        ) {
          merged[key] = this.mergeConfig(defaultConfig[key], userConfig[key]);
        } else {
          // Otherwise just override with user value
          merged[key] = userConfig[key];
        }
      }
    }

    return merged;
  },

  markup: function (el) {
    // Create the outer wrapper
    const wrapper = document.createElement('div');
    wrapper.className = this.config.classes.wrapper;

    // Clone the original element to avoid removing it from its current position
    const playerClone = el.cloneNode(true);

    // Create the player cover
    const playerCover = document.createElement('div');
    playerCover.className = this.config.classes.cover;

    // Create the image
    const coverImage = document.createElement('img');
    coverImage.src = this.config.picture.src;
    coverImage.width = this.config.picture.width;
    coverImage.height = this.config.picture.height;
    coverImage.alt = '';
    coverImage.setAttribute('loading', 'lazy');

    // Create the button
    const coverButton = document.createElement('button');
    coverButton.type = 'button';
    coverButton.className = this.config.classes.button;

    // Create the play icon
    const playIcon = document.createElement('span');
    playIcon.className = this.config.classes.buttonIcon;

    // Create the spinner
    const buttonSpinner = document.createElement('div');
    buttonSpinner.className = this.config.classes.buttonSpinner;

    // Create spinner divs
    for (let i = 0; i < 4; i++) {
      const spinnerDiv = document.createElement('div');
      buttonSpinner.appendChild(spinnerDiv);
    }

    // Assemble the button
    coverButton.appendChild(playIcon);
    coverButton.appendChild(buttonSpinner);

    // Assemble the cover
    playerCover.appendChild(coverImage);
    playerCover.appendChild(coverButton);

    // Assemble the final structure
    wrapper.appendChild(playerClone);
    wrapper.appendChild(playerCover);

    return wrapper;
  },

  bind: function () {
    // Construct selectors based on config
    const wrapperSelector = `.${this.config.classes.wrapper}`;
    const playerSelector = this.config.selector;
    const playSelector = `.${this.config.classes.button}`;
    const closeSelector = `.${this.config.classes.close}`; // Utilisation de la classe close depuis la config

    document.querySelectorAll(wrapperSelector).forEach(el => {
      const player = el.querySelector(playerSelector);
      const play = el.querySelector(playSelector);
      const close = el.querySelector(closeSelector);

      const type = player.getAttribute('data-type');
      const id = player.getAttribute('data-id');
      const uid = player.getAttribute('id');

      // Click handlers
      play.addEventListener('click', () => {
        el.classList.add(this.config.classes.stateLoading);

        switch (type) {
          case 'youtube':
            chickenYoutube.initPlayer(id, uid, this.config);
            break;
          case 'dailymotion':
            chickenDailymotion.initPlayer(id, uid, this.config);
            break;
          case 'vimeo':
            chickenVimeo.initPlayer(id, uid, this.config);
            break;
          default:
            console.error('Type de player non supporté');
            break;
        }
      });

      if (close) {
        close.addEventListener('click', () => {
          el.classList.remove(this.config.classes.statePlaying);

          switch (type) {
            case 'youtube':
              chickenYoutube.stopPlayer(id);
              break;
            case 'dailymotion':
              chickenDailymotion.stopPlayer(id);
              break;
            case 'vimeo':
              chickenVimeo.stopPlayer(id);
              break;
            default:
              console.error('Type de player non supporté');
              break;
          }
        });
      }
    });
  }
};

export default chickenPlayer;