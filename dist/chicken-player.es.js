class l {
  constructor() {
    this.apiReady = !1, this.tempPlayerUid = null, this.tempPlayerId = null, this.videos = [], this.timers = [], this.config = {};
  }
  /**
   * Initialize the player with configuration
   * @param {string} id - Video ID
   * @param {string} uid - Player unique ID
   * @param {Object} config - Player configuration
   */
  initPlayer(e, t, s) {
    this.apiReady ? this.attemptPlayer(t, e) : (this.tempPlayerUid = t, this.tempPlayerId = e, this.config = s, this.initApi());
  }
  /**
   * Initialize the video API
   * @abstract
   */
  initApi() {
    throw new Error("initApi must be implemented by child class");
  }
  /**
   * Create a new player instance
   * @param {string} uid - Player unique ID
   * @param {string} id - Video ID
   * @abstract
   */
  createPlayer(e, t) {
    throw new Error("createPlayer must be implemented by child class");
  }
  /**
   * Attempt to create or start the player
   * @param {string} uid - Player unique ID
   * @param {string} id - Video ID
   */
  attemptPlayer(e, t) {
    this.videos[e] ? setTimeout(() => {
      this.startPlayer(e);
    }, 1500) : this.createPlayer(e, t);
  }
  /**
   * Stop the player
   * @param {string} uid - Player unique ID
   */
  stopPlayer(e) {
    document.querySelector(`#${e}`).dispatchEvent(this.config.events.stop), this.videos[e].pause();
  }
  /**
   * Start the player
   * @param {string} uid - Player unique ID
   */
  startPlayer(e) {
    document.querySelector(`#${e}`).dispatchEvent(this.config.events.play), this.videos[e].play();
  }
  /**
   * Handle player ready state
   * @param {string} uid - Player unique ID
   */
  onPlayerReady(e) {
    const t = document.querySelector(`#${e}`), s = `.${this.config.classes.wrapper}`, i = t.closest(s);
    t.addEventListener("chickenPlayer.play", () => {
      i.classList.remove(this.config.classes.stateLoading), i.classList.add(this.config.classes.statePlaying);
    }), t.addEventListener("chickenPlayer.stop", () => {
      i.classList.remove(this.config.classes.statePlaying);
    }), this.startPlayer(e);
  }
  /**
   * Handle player state changes
   * @param {string} uid - Player unique ID
   */
  onPlayerStateChange(e) {
    const t = document.querySelector(`#${e}`);
    this.videos[e].on("pause", () => {
      this.timers[e] = setTimeout(() => {
        t.dispatchEvent(this.config.events.stop);
      }, 1e3);
    }), this.videos[e].on("play", () => {
      clearTimeout(this.timers[e]), t.dispatchEvent(this.config.events.play);
    });
  }
}
class u extends l {
  /**
   * Initialize the Dailymotion API
   */
  initApi() {
    if (!this.config.player.dailymotion.playerId)
      return console.error("Dailymotion player ID is not set"), !1;
    const e = document.createElement("script");
    e.src = `https://geo.dailymotion.com/libs/player/${this.config.player.dailymotion.playerId}.js`;
    const t = document.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(e, t);
  }
  /**
   * Create a new Dailymotion player instance
   * @param {string} uid - Player unique ID
   * @param {string} id - Video ID
   */
  createPlayer(e, t) {
    this.videos[e] || dailymotion.createPlayer(e, {
      video: t,
      ...this.config.player.dailymotion
    }).then((s) => {
      this.videos[e] = s, this.onPlayerReady(e), this.onPlayerStateChange(e);
    });
  }
}
const o = new u();
window.dailymotion === void 0 && (window.dailymotion = {
  onScriptLoaded: () => {
    o.apiReady = !0, o.attemptPlayer(
      o.tempPlayerUid,
      o.tempPlayerId
    );
  }
});
class g extends l {
  /**
   * Initialize the YouTube API
   */
  initApi() {
    const e = document.createElement("script");
    e.src = "//www.youtube.com/iframe_api";
    const t = document.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(e, t);
  }
  /**
   * Create a new YouTube player instance
   * @param {string} uid - Player unique ID
   * @param {string} id - Video ID
   */
  createPlayer(e, t) {
    this.videos[e] || (this.videos[e] = new YT.Player(e, {
      height: this.config.player.height,
      width: this.config.player.width,
      videoId: t,
      host: this.config.player.youtube.host,
      events: {
        onReady: () => this.onPlayerReady(e),
        onStateChange: (s) => this.onYouTubeStateChange(e, s)
      },
      ...this.config.player.youtube
    }));
  }
  /**
   * Handle YouTube specific state changes
   * @param {string} uid - Player unique ID
   * @param {Object} event - YouTube player event
   */
  onYouTubeStateChange(e, t) {
    const s = document.querySelector(`#${e}`);
    (t.data === 0 || t.data === 2) && (this.timers[e] = setTimeout(() => {
      s.dispatchEvent(this.config.events.stop);
    }, 1e3)), t.data === 1 && (clearTimeout(this.timers[e]), s.dispatchEvent(this.config.events.play));
  }
  /**
   * Stop the YouTube player
   * @param {string} uid - Player unique ID
   */
  stopPlayer(e) {
    document.querySelector(`#${e}`).dispatchEvent(this.config.events.stop), this.videos[e].stopVideo();
  }
  /**
   * Start the YouTube player
   * @param {string} uid - Player unique ID
   */
  startPlayer(e) {
    document.querySelector(`#${e}`).dispatchEvent(this.config.events.play), this.videos[e].playVideo();
  }
}
const n = new g();
window.onYouTubeIframeAPIReady = function() {
  n.apiReady = !0, n.attemptPlayer(
    n.tempPlayerUid,
    n.tempPlayerId
  );
};
class f extends l {
  /**
   * Initialize the Vimeo API
   */
  initApi() {
    const e = document.createElement("script");
    e.src = "//player.vimeo.com/api/player.js", e.onload = window.onVimeoReadyCallback;
    const t = document.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(e, t);
  }
  /**
   * Create a new Vimeo player instance
   * @param {string} uid - Player unique ID
   * @param {string} id - Video ID
   */
  createPlayer(e, t) {
    this.videos[e] || (this.videos[e] = new Vimeo.Player(e, {
      height: this.config.player.height,
      width: this.config.player.width,
      id: t,
      ...this.config.player.vimeo
    }), this.onPlayerReady(e), this.onPlayerStateChange(e));
  }
}
const c = new f();
window.onVimeoReadyCallback = function() {
  c.apiReady = !0, c.attemptPlayer(
    c.tempPlayerUid,
    c.tempPlayerId
  );
};
const v = {
  selector: ".chicken-player",
  player: {
    width: 600,
    height: 400,
    /* Youtube defaults */
    /* See: https://developers.google.com/youtube/player_parameters */
    youtube: {
      host: "https://www.youtube-nocookie.com",
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
      muted: !1,
      loop: !1
    },
    /* Dailymotion defaults */
    /* See: https://developers.dailymotion.com/guides/getting-started-with-web-sdk/ */
    dailymotion: {
      playerId: null,
      params: {
        startTime: 0,
        scaleMode: "fit",
        loop: !1,
        mute: !1
      }
    }
  },
  classes: {
    wrapper: "cbo-chickenplayer",
    cover: "player-cover",
    button: "cover-button",
    buttonIcon: "button-icon",
    buttonSpinner: "button-spinner",
    close: "player-close",
    statePlaying: "player--playing",
    stateLoading: "player--loading",
    stateError: "player--error",
    stateReady: "player--ready"
  },
  picture: {
    src: "https://placehold.co/600x400",
    width: 600,
    height: 400
  },
  events: {
    play: new Event("chickenPlayer.play"),
    stop: new Event("chickenPlayer.stop")
  }
};
class P {
  /**
   * Initialize a new Chicken Player instance
   * @param {Object} opts - User configuration options
   */
  constructor(e = {}) {
    this.config = this.mergeConfig(v, e), typeof window < "u" && typeof document < "u" && this.init();
  }
  /**
   * Initialize the player with the current configuration
   * Creates markup and binds events for all player elements
   */
  init() {
    document.querySelectorAll(`${this.config.selector}:not(.${this.config.classes.stateReady})`).forEach((e) => {
      const t = this.createMarkup(e);
      e.parentNode.replaceChild(t, e);
    }), this.bindEvents();
  }
  /**
   * Deep merge two configuration objects
   * @param {Object} defaultConfig - Default configuration
   * @param {Object} userConfig - User provided configuration
   * @returns {Object} Merged configuration
   */
  mergeConfig(e, t) {
    const s = { ...e };
    for (const i in t)
      t.hasOwnProperty(i) && (typeof t[i] == "object" && t[i] !== null && typeof e[i] == "object" && e[i] !== null ? s[i] = this.mergeConfig(e[i], t[i]) : s[i] = t[i]);
    return s;
  }
  /**
   * Create the player markup structure
   * @param {HTMLElement} el - Original player element
   * @returns {HTMLElement} Complete player markup
   */
  createMarkup(e) {
    const t = document.createElement("div");
    t.className = this.config.classes.wrapper;
    const s = e.cloneNode(!0), i = this.createCover(), a = this.createButton();
    return t.appendChild(s), t.appendChild(i), i.appendChild(a), t;
  }
  /**
   * Create the player cover element
   * @returns {HTMLElement} Cover element
   */
  createCover() {
    const e = document.createElement("div");
    e.className = this.config.classes.cover;
    const t = document.createElement("img");
    return t.src = this.config.picture.src, t.width = this.config.picture.width, t.height = this.config.picture.height, t.alt = "", t.setAttribute("loading", "lazy"), e.appendChild(t), e;
  }
  /**
   * Create the play button element
   * @returns {HTMLElement} Button element
   */
  createButton() {
    const e = document.createElement("button");
    e.type = "button", e.className = this.config.classes.button;
    const t = document.createElement("span");
    t.className = this.config.classes.buttonIcon;
    const s = document.createElement("div");
    s.className = this.config.classes.buttonSpinner;
    for (let i = 0; i < 4; i++) {
      const a = document.createElement("div");
      s.appendChild(a);
    }
    return e.appendChild(t), e.appendChild(s), e;
  }
  /**
   * Bind event listeners to player elements
   * Only binds events to elements that haven't been initialized yet
   */
  bindEvents() {
    const e = this.config.selector, t = `.${this.config.classes.button}`, s = `.${this.config.classes.close}`;
    document.querySelectorAll(`${e}:not(.${this.config.classes.stateReady})`).forEach((i) => {
      const a = i.parentElement, d = a.querySelector(t), p = a.querySelector(s), h = i.getAttribute("data-type"), y = i.getAttribute("data-id"), m = i.getAttribute("id");
      d.addEventListener("click", () => {
        a.classList.add(this.config.classes.stateLoading), this.handlePlay(h, y, m);
      }), p && p.addEventListener("click", () => {
        a.classList.remove(this.config.classes.statePlaying), this.handleStop(h, y);
      }), a.classList.add(this.config.classes.stateReady);
    });
  }
  /**
   * Handle play action based on player type
   * @param {string} type - Player type (youtube, dailymotion, vimeo)
   * @param {string} id - Video ID
   * @param {string} uid - Player unique ID
   */
  handlePlay(e, t, s) {
    switch (e) {
      case "youtube":
        n.initPlayer(t, s, this.config);
        break;
      case "dailymotion":
        o.initPlayer(t, s, this.config);
        break;
      case "vimeo":
        c.initPlayer(t, s, this.config);
        break;
      default:
        console.error("Unsupported player type:", e);
        break;
    }
  }
  /**
   * Handle stop action based on player type
   * @param {string} type - Player type (youtube, dailymotion, vimeo)
   * @param {string} id - Video ID
   */
  handleStop(e, t) {
    switch (e) {
      case "youtube":
        n.stopPlayer(t);
        break;
      case "dailymotion":
        o.stopPlayer(t);
        break;
      case "vimeo":
        c.stopPlayer(t);
        break;
      default:
        console.error("Unsupported player type:", e);
        break;
    }
  }
}
export {
  P as default
};
