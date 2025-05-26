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
const a = new u();
window.dailymotion === void 0 && (window.dailymotion = {
  onScriptLoaded: () => {
    a.apiReady = !0, a.attemptPlayer(
      a.tempPlayerUid,
      a.tempPlayerId
    );
  }
});
class f extends l {
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
const n = new f();
window.onYouTubeIframeAPIReady = function() {
  n.apiReady = !0, n.attemptPlayer(
    n.tempPlayerUid,
    n.tempPlayerId
  );
};
class v extends l {
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
const r = new v();
window.onVimeoReadyCallback = function() {
  r.apiReady = !0, r.attemptPlayer(
    r.tempPlayerUid,
    r.tempPlayerId
  );
};
class P extends l {
  /**
   * Initialize the HTML5 player
   * No API initialization needed for HTML5
   */
  initApi() {
    console.log("initApi"), this.apiReady = !0, this.attemptPlayer(
      this.tempPlayerUid,
      this.tempPlayerId
    );
  }
  /**
   * Create a new HTML5 player instance
   * @param {string} uid - Player unique ID
   * @param {string} id - Video URL
   */
  createPlayer(e, t) {
    if (console.log("createPlayer", e, t), !this.videos[e]) {
      const s = document.createElement("video");
      s.id = e, s.className = "html5-player", s.controls = !0, s.preload = "metadata", s.setAttribute("playsinline", ""), s.setAttribute("webkit-playsinline", "");
      const i = document.createElement("source");
      i.src = t, i.type = this.getVideoType(t), s.appendChild(i);
      const o = document.querySelector(`#${e}`);
      o && o.parentNode.replaceChild(s, o), this.videos[e] = s, this.onPlayerReady(e), this.onPlayerStateChange(e);
    }
  }
  /**
   * Get video MIME type from URL
   * @param {string} url - Video URL
   * @returns {string} Video MIME type
   */
  getVideoType(e) {
    const t = e.split(".").pop().toLowerCase();
    return console.log("extension", t), {
      mp4: "video/mp4",
      webm: "video/webm",
      ogg: "video/ogg",
      mov: "video/quicktime",
      m4v: "video/x-m4v"
    }[t] || "video/mp4";
  }
  /**
   * Stop the HTML5 player
   * @param {string} uid - Player unique ID
   */
  stopPlayer(e) {
    document.querySelector(`#${e}`).dispatchEvent(this.config.events.stop), this.videos[e].pause();
  }
  /**
   * Start the HTML5 player
   * @param {string} uid - Player unique ID
   */
  startPlayer(e) {
    document.querySelector(`#${e}`).dispatchEvent(this.config.events.play), this.videos[e].play();
  }
  /**
   * Handle player state changes
   * @param {string} uid - Player unique ID
   */
  onPlayerStateChange(e) {
    const t = document.querySelector(`#${e}`);
    this.videos[e].addEventListener("pause", () => {
      this.timers[e] = setTimeout(() => {
        t.dispatchEvent(this.config.events.stop);
      }, 1e3);
    }), this.videos[e].addEventListener("play", () => {
      clearTimeout(this.timers[e]), t.dispatchEvent(this.config.events.play);
    });
  }
}
const d = new P(), b = {
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
    },
    /* HTML5 defaults */
    html5: {
      controls: !0,
      preload: "metadata",
      playsinline: !0
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
class w {
  /**
   * Initialize a new Chicken Player instance
   * @param {Object} opts - User configuration options
   */
  constructor(e = {}) {
    this.config = this.mergeConfig(b, e), typeof window < "u" && typeof document < "u" && this.init();
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
    const s = e.cloneNode(!0), i = this.createCover(), o = this.createButton();
    return t.appendChild(s), t.appendChild(i), i.appendChild(o), t;
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
      const o = document.createElement("div");
      s.appendChild(o);
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
      const o = i.parentElement, m = o.querySelector(t), p = o.querySelector(s), h = i.getAttribute("data-type"), y = i.getAttribute("data-id"), g = i.getAttribute("id");
      m.addEventListener("click", () => {
        o.classList.add(this.config.classes.stateLoading), this.handlePlay(h, y, g);
      }), p && p.addEventListener("click", () => {
        o.classList.remove(this.config.classes.statePlaying), this.handleStop(h, y);
      }), o.classList.add(this.config.classes.stateReady);
    });
  }
  /**
   * Handle play action based on player type
   * @param {string} type - Player type (youtube, dailymotion, vimeo, html5)
   * @param {string} id - Video ID or URL
   * @param {string} uid - Player unique ID
   */
  handlePlay(e, t, s) {
    switch (e) {
      case "youtube":
        n.initPlayer(t, s, this.config);
        break;
      case "dailymotion":
        a.initPlayer(t, s, this.config);
        break;
      case "vimeo":
        r.initPlayer(t, s, this.config);
        break;
      case "html5":
        d.initPlayer(t, s, this.config);
        break;
      default:
        console.error("Unsupported player type:", e);
        break;
    }
  }
  /**
   * Handle stop action based on player type
   * @param {string} type - Player type (youtube, dailymotion, vimeo, html5)
   * @param {string} id - Video ID or URL
   */
  handleStop(e, t) {
    switch (e) {
      case "youtube":
        n.stopPlayer(t);
        break;
      case "dailymotion":
        a.stopPlayer(t);
        break;
      case "vimeo":
        r.stopPlayer(t);
        break;
      case "html5":
        d.stopPlayer(t);
        break;
      default:
        console.error("Unsupported player type:", e);
        break;
    }
  }
}
export {
  w as default
};
