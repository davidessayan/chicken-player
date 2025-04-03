/**
 * Chicken Player - Main Initialization
 * @author David Essayan
 * @version 1.0.0
 * @description Main initialization file for the Chicken Player library
 */

import chickenDailymotion from './chicken-dailymotion';
import chickenYoutube from './chicken-youtube';
import chickenVimeo from './chicken-vimeo';

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
    height: 400,
  },
  events: {
    play: new Event('chickenPlayer.play'),
    stop: new Event('chickenPlayer.stop'),
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
  }

  /**
   * Initialize the player with the current configuration
   */
  init() {
    document.querySelectorAll(this.config.selector).forEach(el => {
      const markup = this.createMarkup(el);
      el.parentNode.replaceChild(markup, el);
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
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = this.config.classes.wrapper;

    // Clone original player
    const playerClone = el.cloneNode(true);

    // Create cover elements
    const cover = this.createCover();
    const button = this.createButton();

    // Assemble structure
    wrapper.appendChild(playerClone);
    wrapper.appendChild(cover);
    cover.appendChild(button);

    return wrapper;
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
   */
  bindEvents() {
    const wrapperSelector = `.${this.config.classes.wrapper}`;
    const playerSelector = this.config.selector;
    const playSelector = `.${this.config.classes.button}`;
    const closeSelector = `.${this.config.classes.close}`;

    document.querySelectorAll(wrapperSelector).forEach(el => {
      const player = el.querySelector(playerSelector);
      const play = el.querySelector(playSelector);
      const close = el.querySelector(closeSelector);

      const type = player.getAttribute('data-type');
      const id = player.getAttribute('data-id');
      const uid = player.getAttribute('id');

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
    });
  }

  /**
   * Handle play action based on player type
   * @param {string} type - Player type (youtube, dailymotion, vimeo)
   * @param {string} id - Video ID
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
      default:
        console.error('Unsupported player type:', type);
        break;
    }
  }

  /**
   * Handle stop action based on player type
   * @param {string} type - Player type (youtube, dailymotion, vimeo)
   * @param {string} id - Video ID
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
      default:
        console.error('Unsupported player type:', type);
        break;
    }
  }
}

// Create and export singleton instance
const chickenPlayer = new ChickenPlayer();
export default chickenPlayer;