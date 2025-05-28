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
    play: new Event('chickenPlayer.play'),
    stop: new Event('chickenPlayer.stop'),
  },

  /* Cookie Consent */
  cookies: {
    active: false,
    message: 'Pour regarder cette vidéo, veuillez accepter les cookies du lecteur vidéo dans vos préférences de confidentialité.',
    eventConsent: 'chickenPlayer.cookies.consent',
    eventReject: 'chickenPlayer.cookies.reject',
    types: ['youtube', 'dailymotion', 'vimeo']
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
        el.getAttribute('data-id') &&
        el.getAttribute('id')
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

    for (const key in userConfig) {
      if (userConfig.hasOwnProperty(key)) {
        if (
          typeof userConfig[key] === 'object' &&
          userConfig[key] !== null &&
          typeof defaultConfig[key] === 'object' &&
          defaultConfig[key] !== null
        ) {
          merged[key] = this.mergeConfig(defaultConfig[key], userConfig[key]);
        } else {
          merged[key] = userConfig[key];
        }
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
    // Getting UID from data-id
    const uid = el.getAttribute('id');

    // Create wrapper
    el.classList.add(this.config.classes.wrapper);
    el.classList.add('player--' + el.getAttribute('data-type'));

    // Create elements
    const object = this.createObject(uid);
    const cover = this.createCover();
    const button = this.createButton();

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
   * @returns {HTMLElement} Cover element
   */
  createCover() {
    const cover = document.createElement('div');
    cover.className = this.config.classes.cover;

    const image = document.createElement('img');
    image.src = this.config.picture.src;
    image.width = this.config.picture.width;
    image.height = this.config.picture.height;
    image.alt = '';
    image.setAttribute('loading', 'lazy');

    cover.appendChild(image);
    return cover;
  }

  /**
   * Create the play button element
   * @returns {HTMLElement} Button element
   */
  createButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = this.config.classes.button;

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

      const type = el.getAttribute('data-type');
      const id = el.getAttribute('data-id');
      const uid = object.getAttribute('id');

      // Play button click handler
      play.addEventListener('click', () => {
        el.classList.add(this.config.classes.stateLoading);
        this.handlePlay(type, id, uid);
      });

      // Close button click handler
      if (close) {
        close.addEventListener('click', () => {
          el.classList.remove(this.config.classes.statePlaying);
          this.handleStop(type, id);
        });
      }

      // Mark wrapper as ready to prevent re-initialization
      el.classList.add(this.config.classes.stateReady);
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
   * Handle stop action based on player type
   * @param {string} type - Player type (youtube, dailymotion, vimeo, html5)
   * @param {string} id - Video ID or URL
   */
  handleStop(type, id) {
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
      case 'html5':
        chickenHtml5.stopPlayer(id);
        break;
      default:
        console.error('Unsupported player type:', type);
        break;
    }
  }
}

export default ChickenPlayer;