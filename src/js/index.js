/**
 * Chicken Player - Main Initialization
 * @author David Essayan
 * @version 1.0.0
 * @description Main initialization file for the Chicken Player library
 */

import chickenDailymotion from './chicken-dailymotion';
import chickenYoutube from './chicken-youtube';
import chickenVimeo from './chicken-vimeo';
import chickenHtml5 from './chicken-html5';
import chickenPlayerConsent from './chicken-player-consent';

import '../scss/main.scss';

/**
 * Default configuration for the player
 * @type {Object}
 */
const defaultConfig = {
  selector: '.chicken-player',
  player: {
    width: 600,
    height: 400,

    /* Youtube defaults */
    /* See: https://developers.google.com/youtube/player_parameters */
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

    /* Vimeo defaults */
    /* See: https://developer.vimeo.com/player/sdk/embed */
    vimeo: {
      muted: false,
      loop: false,
    },

    /* Dailymotion defaults */
    /* See: https://developers.dailymotion.com/guides/getting-started-with-web-sdk/ */
    dailymotion: {
      playerId: null,
      params: {
        startTime: 0,
        scaleMode: 'fit',
        loop: false,
        mute: false,
      }
    },

    /* HTML5 defaults */
    /* See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video */
    html5: {
      controls: true,
      preload: 'auto',
      playsinline: false,
      autoplay: false,
      loop: false,
      muted: false,
      poster: '',
      width: 'auto',
      height: 'auto',
      crossorigin: '',
      disablePictureInPicture: false,
      disableRemotePlayback: false,
      controlsList: ''
    }
  },

  /* CSS Classes */
  classes: {
    wrapper: 'cbo-chickenplayer',
    object: 'player-object',
    cover: 'player-cover',
    button: 'cover-button',
    buttonIcon: 'button-icon',
    buttonSpinner: 'button-spinner',
    close: 'player-close',
    statePlaying: 'player--playing',
    stateLoading: 'player--loading',
    stateError: 'player--error',
    stateReady: 'player--ready',
    stateFocus: 'player--focus',
    needConsent: 'player--needconsent',
    consentMessage: 'cover-needconsent'
  },

  /* Picture */
  picture: {
    src: 'https://unpkg.com/chicken-player/dist/placeholder.png',
    width: 600,
    height: 400,
  },

  /* Events */
  events: {
    play: new Event('chickenPlayer.play', { bubbles: true }),
    stop: new Event('chickenPlayer.stop', { bubbles: true }),
  },

  /* Cookie Consent */
  cookies: {
    active: false,
    message: 'Acceptez les cookies pour regarder cette vidéo.',
    eventConsent: 'chickenPlayer.cookies.consent',
    eventReject: 'chickenPlayer.cookies.reject',
    types: ['youtube', 'dailymotion', 'vimeo']
  },

  /* Accessibility */
  a11y: {
    playLabel: 'Lire la vidéo',
    closeLabel: 'Fermer la vidéo',
    titleFormat: '{label} : {title}',
  }
};

/**
 * Main Chicken Player class
 */
class ChickenPlayer {
  /**
   * Initialize a new Chicken Player instance
   * @param {Object} opts - User configuration options
   */
  constructor(opts = {}) {
    this.config = this.mergeConfig(defaultConfig, opts);

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.init();
    }
  }

  /**
   * Initialize the player with the current configuration
   * Creates markup and binds events for all player elements
   */
  init() {
    document.querySelectorAll(`${this.config.selector}:not(.${this.config.classes.stateReady})`).forEach(el => {
      if (
        el.getAttribute('data-type') &&
        el.getAttribute('data-id')
      ) {
        const markup = this.createMarkup(el);
        el.parentNode.replaceChild(markup, el);
      }
    });

    this.config.cookies.types.forEach(type => {
      new chickenPlayerConsent(type, this.config);
    });

    this.bindEvents();
  }

  /**
   * Deep merge two configuration objects
   * @param {Object} defaultConfig - Default configuration
   * @param {Object} userConfig - User provided configuration
   * @returns {Object} Merged configuration
   */
  mergeConfig(defaultConfig, userConfig) {
    const merged = { ...defaultConfig };

    for (const key of Object.keys(userConfig)) {
      if (
        typeof userConfig[key] === 'object' &&
        userConfig[key] !== null &&
        !Array.isArray(userConfig[key]) &&
        typeof defaultConfig[key] === 'object' &&
        defaultConfig[key] !== null &&
        !Array.isArray(defaultConfig[key])
      ) {
        merged[key] = this.mergeConfig(defaultConfig[key], userConfig[key]);
      } else {
        merged[key] = userConfig[key];
      }
    }

    return merged;
  }

  /**
   * Create the player markup structure
   * @param {HTMLElement} el - Original player element
   * @returns {HTMLElement} Complete player markup
   */
  createMarkup(el) {
    // Getting UID from data-id or generate one if not present
    let uid = el.getAttribute('id');

    if (!uid) {
      // Generate a unique ID with chickenPlayer_ prefix
      uid = 'chickenPlayer_' + Math.random().toString(36).slice(2, 11);
      el.setAttribute('id', uid);
    }

    // Create wrapper
    el.classList.add(this.config.classes.wrapper);
    el.classList.add('player--' + el.getAttribute('data-type'));

    // Create elements
    const object = this.createObject(uid);
    const cover = this.createCover(el);
    const button = this.createButton(el.getAttribute('data-title'));

    // Assemble structure
    el.appendChild(object);
    el.appendChild(cover);
    cover.appendChild(button);

    return el;
  }

  createObject(uid) {
    const object = document.createElement('div');
    object.className = this.config.classes.object;
    object.setAttribute('id', uid + '-object');
    return object;
  }

  /**
   * Create the player cover element
   * @param {HTMLElement} originalEl - Original player element
   * @returns {HTMLElement} Cover element
   */
  createCover(originalEl) {
    const cover = document.createElement('div');
    cover.className = this.config.classes.cover;

    // Check if there's an existing img tag in the original element
    const existingImg = originalEl.querySelector('img');

    if (existingImg) {
      // Move the existing image to the cover (don't clone, move it)
      cover.appendChild(existingImg);
    } else if (this.config.picture !== false) {
      // Use default image from config only if picture is not disabled
      const image = document.createElement('img');
      image.src = this.config.picture.src;
      image.width = this.config.picture.width;
      image.height = this.config.picture.height;
      image.alt = '';
      image.setAttribute('loading', 'lazy');

      cover.appendChild(image);
    }
    // If picture is false and no existing image, no image will be added

    return cover;
  }

  /**
   * Add the video title to a button label
   * @param {string} label - Button label
   * @param {string|null} title - Video title (data-title)
   * @returns {string} Label
   */
  formatLabel(label, title) {
    if (!title) return label;

    // Replacer functions keep "$" sequences of the title literal
    return this.config.a11y.titleFormat
      .replace('{label}', () => label)
      .replace('{title}', () => title);
  }

  /**
   * Create the play button element
   * @param {string|null} title - Video title (data-title)
   * @returns {HTMLElement} Button element
   */
  createButton(title) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = this.config.classes.button;
    button.setAttribute('aria-label', this.formatLabel(this.config.a11y.playLabel, title));

    const icon = document.createElement('span');
    icon.className = this.config.classes.buttonIcon;

    const spinner = document.createElement('div');
    spinner.className = this.config.classes.buttonSpinner;

    // Create spinner divs
    for (let i = 0; i < 4; i++) {
      const spinnerDiv = document.createElement('div');
      spinner.appendChild(spinnerDiv);
    }

    button.appendChild(icon);
    button.appendChild(spinner);

    return button;
  }

  /**
   * Bind event listeners to player elements
   * Only binds events to elements that haven't been initialized yet
   */
  bindEvents() {
    const playerSelector = this.config.selector;
    const objectSelector = `.${this.config.classes.object}`;
    const playSelector = `.${this.config.classes.button}`;
    const closeSelector = `.${this.config.classes.close}`;

    document.querySelectorAll(`${playerSelector}:not(.${this.config.classes.stateReady})`).forEach(el => {
      const object = el.querySelector(objectSelector);
      const play = el.querySelector(playSelector);
      const close = el.querySelector(closeSelector);

      // Safety check: ensure all required elements exist
      if (!object || !play) {
        console.warn('Chicken Player: Required elements not found for player', el);
        return;
      }

      const type = el.getAttribute('data-type');
      const id = el.getAttribute('data-id');
      const uid = object.getAttribute('id');
      const title = el.getAttribute('data-title');

      // Play button click handler
      play.addEventListener('click', () => {
        // The button is only hidden by CSS while consent is pending
        if (chickenPlayerConsent.isWaiting(el)) return;

        el.classList.add(this.config.classes.stateLoading);
        this.handlePlay(type, id, uid);
      });

      // Close button click handler
      if (close) {
        close.setAttribute('aria-label', this.formatLabel(this.config.a11y.closeLabel, title));
        close.addEventListener('click', () => {
          el.classList.remove(this.config.classes.statePlaying);
          this.handleStop(type, uid);
        });
      }

      this.bindFocus(el, uid, play);

      // Name the media once the provider has created it
      if (title) {
        el.addEventListener(this.config.events.play.type, () => {
          const target = this.getMediaTarget(uid);
          if (target) target.setAttribute(target.matches('video') ? 'aria-label' : 'title', title);
        });
      }

      // Mark wrapper as ready to prevent re-initialization
      el.classList.add(this.config.classes.stateReady);
    });
  }

  /**
   * Get the focusable element of the media (iframe or video)
   * @param {string} uid - Player unique ID
   * @returns {HTMLElement|null} Media element
   */
  getMediaTarget(uid) {
    // The provider may have replaced the object element, so it is queried each time
    const media = document.getElementById(uid);
    if (!media) return null;

    return media.matches('iframe, video') ? media : media.querySelector('iframe, video');
  }

  /**
   * Keep keyboard focus on the visible layer: the media while playing, the cover otherwise
   * @param {HTMLElement} el - Player wrapper
   * @param {string} uid - Player unique ID
   * @param {HTMLElement} play - Play button
   */
  bindFocus(el, uid, play) {
    const cover = el.querySelector(`.${this.config.classes.cover}`);

    el.addEventListener(this.config.events.play.type, () => {
      const media = document.getElementById(uid);
      if (!media) return;

      media.inert = false;
      if (cover.contains(document.activeElement)) {
        const keyboard = document.activeElement.matches(':focus-visible');
        const target = this.getMediaTarget(uid);

        if (target) {
          target.focus({ preventScroll: true });

          // An iframe never matches :focus-visible, so keyboard focus is shown on the wrapper
          if (keyboard && document.activeElement === target) {
            el.classList.add(this.config.classes.stateFocus);
            target.addEventListener('blur', () => {
              el.classList.remove(this.config.classes.stateFocus);
            }, { once: true });
          }
        }
      }
      cover.inert = true;
    });

    el.addEventListener(this.config.events.stop.type, () => {
      const media = document.getElementById(uid);
      cover.inert = false;
      if (!media) return;

      if (media.contains(document.activeElement)) play.focus({ preventScroll: true });
      media.inert = true;
    });
  }

  /**
   * Handle play action based on player type
   * @param {string} type - Player type (youtube, dailymotion, vimeo, html5)
   * @param {string} id - Video ID or URL
   * @param {string} uid - Player unique ID
   */
  handlePlay(type, id, uid) {
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
      case 'html5':
        chickenHtml5.initPlayer(id, uid, this.config);
        break;
      default:
        console.error('Unsupported player type:', type);
        break;
    }
  }

  /**
   * Play all players or a specific player
   * @param {string} [selector] - Optional CSS selector to target specific players
   */
  play(selector = null) {
    const targetSelector = selector || this.config.selector;
    const players = document.querySelectorAll(targetSelector);

    players.forEach(playerEl => {
      const type = playerEl.getAttribute('data-type');
      const id = playerEl.getAttribute('data-id');
      // Looked up by id: Dailymotion and HTML5 replace the object element without its class
      const object = document.getElementById(`${playerEl.id}-object`);

      if (type && id && object && !chickenPlayerConsent.isWaiting(playerEl)) {
        const uid = object.getAttribute('id');
        playerEl.classList.add(this.config.classes.stateLoading);
        this.handlePlay(type, id, uid);
      }
    });
  }

  /**
   * Stop all players or a specific player
   * @param {string} [selector] - Optional CSS selector to target specific players
   */
  stop(selector = null) {
    const targetSelector = selector || this.config.selector;
    const players = document.querySelectorAll(targetSelector);

    players.forEach(playerEl => {
      const type = playerEl.getAttribute('data-type');
      // Looked up by id: Dailymotion and HTML5 replace the object element without its class
      const object = document.getElementById(`${playerEl.id}-object`);

      if (type && object) {
        const uid = object.getAttribute('id');
        playerEl.classList.remove(this.config.classes.statePlaying);
        this.handleStop(type, uid);
      }
    });
  }

  /**
   * Handle stop action based on player type
   * @param {string} type - Player type (youtube, dailymotion, vimeo, html5)
   * @param {string} uid - Player unique ID
   */
  handleStop(type, uid) {
    switch (type) {
      case 'youtube':
        chickenYoutube.stopPlayer(uid);
        break;
      case 'dailymotion':
        chickenDailymotion.stopPlayer(uid);
        break;
      case 'vimeo':
        chickenVimeo.stopPlayer(uid);
        break;
      case 'html5':
        chickenHtml5.stopPlayer(uid);
        break;
      default:
        console.error('Unsupported player type:', type);
        break;
    }
  }

}

export default ChickenPlayer;