class p {
  constructor() {
    this.apiReady = !1, this.apiLoading = !1, this.tempPlayerUid = null, this.tempPlayerId = null, this.pendingPlayers = [], this.videos = [], this.timers = [], this.config = {};
  }
  /**
   * Initialize the player with configuration
   * @param {string} id - Video ID
   * @param {string} uid - Player unique ID
   * @param {Object} config - Player configuration
   */
  initPlayer(e, t, i) {
    this.config = {
      needConsent: !1,
      ...i
    }, this.apiReady ? this.attemptPlayer(t, e) : (this.tempPlayerUid = t, this.tempPlayerId = e, this.queuePlayer(t, e), this.apiLoading || (this.apiLoading = !0, this.initApi() === !1 && (this.apiLoading = !1)));
  }
  /**
   * Queue player initialization while waiting for API readiness
   * @param {string} uid - Player unique ID
   * @param {string} id - Video ID
   */
  queuePlayer(e, t) {
    this.pendingPlayers.find((s) => s.uid === e) || this.pendingPlayers.push({ uid: e, id: t });
  }
  /**
   * Flush all pending players once API is ready
   */
  flushPendingPlayers() {
    const e = [...this.pendingPlayers];
    this.pendingPlayers = [], e.forEach(({ uid: t, id: i }) => {
      this.attemptPlayer(t, i);
    });
  }
  /**
   * Mark API as ready and process pending players
   */
  onApiReady() {
    this.apiReady = !0, this.apiLoading = !1, this.flushPendingPlayers();
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
    const t = document.querySelector(`#${e}`), i = `.${this.config.classes.wrapper}`, s = t.closest(i);
    t.addEventListener("chickenPlayer.play", () => {
      s.classList.remove(this.config.classes.stateLoading), s.classList.add(this.config.classes.statePlaying);
    }), t.addEventListener("chickenPlayer.stop", () => {
      s.classList.remove(this.config.classes.statePlaying);
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
class b extends p {
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
    }).then((i) => {
      this.videos[e] = i, this.onPlayerReady(e), this.onPlayerStateChange(e);
    });
  }
}
const l = new b();
if (window.dailymotion === void 0)
  window.dailymotion = {
    onScriptLoaded: () => {
      l.onApiReady();
    }
  };
else {
  const a = window.dailymotion.onScriptLoaded;
  window.dailymotion.onScriptLoaded = () => {
    typeof a == "function" && a(), l.onApiReady();
  };
}
class P extends p {
  /**
   * Initialize the YouTube API
   */
  initApi() {
    if (window.YT && typeof window.YT.Player == "function") {
      this.onApiReady();
      return;
    }
    if (document.querySelector('script[src*="youtube.com/iframe_api"]'))
      return;
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
        onStateChange: (i) => this.onYouTubeStateChange(e, i)
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
    const i = document.querySelector(`#${e}`);
    (t.data === 0 || t.data === 2) && (this.timers[e] = setTimeout(() => {
      i.dispatchEvent(this.config.events.stop);
    }, 1e3)), t.data === 1 && (clearTimeout(this.timers[e]), i.dispatchEvent(this.config.events.play));
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
const h = new P(), f = window.onYouTubeIframeAPIReady;
window.onYouTubeIframeAPIReady = function() {
  typeof f == "function" && f(), h.onApiReady();
};
class w extends p {
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
const d = new w(), m = window.onVimeoReadyCallback;
window.onVimeoReadyCallback = function() {
  typeof m == "function" && m(), d.onApiReady();
};
class k extends p {
  /**
   * Initialize the HTML5 player
   * No API initialization needed for HTML5
   */
  initApi() {
    this.apiReady = !0, this.attemptPlayer(
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
    if (!this.videos[e]) {
      const i = document.createElement("video");
      i.id = e, i.className = "html5-player";
      const s = this.config.player.html5;
      i.controls = s.controls, i.preload = s.preload, i.autoplay = s.autoplay, i.loop = s.loop, i.muted = s.muted, i.width = s.width, i.height = s.height, i.setAttribute("playsinline", ""), i.setAttribute("webkit-playsinline", ""), s.poster && i.setAttribute("poster", s.poster), s.crossorigin && i.setAttribute("crossorigin", s.crossorigin), s.disablePictureInPicture && i.setAttribute("disablePictureInPicture", ""), s.disableRemotePlayback && i.setAttribute("disableRemotePlayback", ""), s.controlsList && i.setAttribute("controlsList", s.controlsList);
      const o = document.createElement("source");
      o.src = t, o.type = this.getVideoType(t), i.appendChild(o);
      const n = document.querySelector(`#${e}`);
      n && n.parentNode.replaceChild(i, n), this.videos[e] = i, this.onPlayerReady(e), this.onPlayerStateChange(e);
    }
  }
  /**
   * Get video MIME type from URL
   * @param {string} url - Video URL
   * @returns {string} Video MIME type
   */
  getVideoType(e) {
    const t = e.split(".").pop().toLowerCase();
    return {
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
const g = new k();
class S {
  constructor(e, t) {
    this.consentState = !1, this.needConsent = t.cookies.active, this.consentEvent = t.cookies.eventConsent, this.rejectEvent = t.cookies.eventReject, this.consentState = !this.needConsent, this.config = t, this.playerType = e, this.wrapper = document.querySelector(`.${t.classes.wrapper}`), this.setPlayerConsent(), this.needConsent && (this.setConsentMessage(), this.setWrapperState()), this.needConsent && this.consentEvent && window.addEventListener(this.consentEvent, () => {
      this.consentState = !0, this.setWrapperState();
    }), this.needConsent && this.rejectEvent && window.addEventListener(this.rejectEvent, () => {
      this.consentState = !1, this.setWrapperState();
    });
  }
  setWrapperState() {
    this.consentState ? this.wrapper.classList.remove(this.config.classes.needConsent) : this.wrapper.classList.add(this.config.classes.needConsent);
  }
  setConsentMessage() {
    const e = this.wrapper.querySelector(`.${this.config.classes.cover}`);
    if (!e) return;
    const t = document.createElement("div");
    t.className = this.config.classes.consentMessage, t.innerHTML = `
            <p>${this.config.cookies.message}</p>
        `, e.appendChild(t);
  }
  setPlayerConsent() {
    var e, t, i, s, o, n;
    (t = (e = this.config.player[this.playerType]) == null ? void 0 : e.cookies) != null && t.active && (this.needConsent = this.config.player[this.playerType].cookies.active, this.wrapper = document.querySelector(`.${this.config.classes.wrapper}.player--${this.playerType}`)), (s = (i = this.config.player[this.playerType]) == null ? void 0 : i.cookies) != null && s.eventConsent && (this.consentEvent = this.config.player[this.playerType].cookies.eventConsent), (n = (o = this.config.player[this.playerType]) == null ? void 0 : o.cookies) != null && n.eventReject && (this.rejectEvent = this.config.player[this.playerType].cookies.eventReject), this.consentState = !this.needConsent;
  }
  hasConsent() {
    return this.consentState;
  }
}
const C = {
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
    /* See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video */
    html5: {
      controls: !0,
      preload: "auto",
      playsinline: !1,
      autoplay: !1,
      loop: !1,
      muted: !1,
      poster: "",
      width: "auto",
      height: "auto",
      crossorigin: "",
      disablePictureInPicture: !1,
      disableRemotePlayback: !1,
      controlsList: ""
    }
  },
  /* CSS Classes */
  classes: {
    wrapper: "cbo-chickenplayer",
    object: "player-object",
    cover: "player-cover",
    button: "cover-button",
    buttonIcon: "button-icon",
    buttonSpinner: "button-spinner",
    close: "player-close",
    statePlaying: "player--playing",
    stateLoading: "player--loading",
    stateError: "player--error",
    stateReady: "player--ready",
    needConsent: "player--needconsent",
    consentMessage: "cover-needconsent"
  },
  /* Picture */
  picture: {
    src: "https://unpkg.com/chicken-player/dist/placeholder.png",
    width: 600,
    height: 400
  },
  /* Events */
  events: {
    play: new Event("chickenPlayer.play"),
    stop: new Event("chickenPlayer.stop")
  },
  /* Cookie Consent */
  cookies: {
    active: !1,
    message: "Pour regarder cette vidéo, veuillez accepter les cookies du lecteur vidéo dans vos préférences de confidentialité.",
    eventConsent: "chickenPlayer.cookies.consent",
    eventReject: "chickenPlayer.cookies.reject",
    types: ["youtube", "dailymotion", "vimeo"]
  }
};
class E {
  /**
   * Initialize a new Chicken Player instance
   * @param {Object} opts - User configuration options
   */
  constructor(e = {}) {
    this.config = this.mergeConfig(C, e), this.players = /* @__PURE__ */ new Map(), typeof window < "u" && typeof document < "u" && this.init();
  }
  /**
   * Initialize the player with the current configuration
   * Creates markup and binds events for all player elements
   */
  init() {
    document.querySelectorAll(`${this.config.selector}:not(.${this.config.classes.stateReady})`).forEach((e) => {
      if (e.getAttribute("data-type") && e.getAttribute("data-id")) {
        const t = this.createMarkup(e);
        e.parentNode.replaceChild(t, e);
      }
    }), this.config.cookies.types.forEach((e) => {
      new S(e, this.config);
    }), this.bindEvents();
  }
  /**
   * Deep merge two configuration objects
   * @param {Object} defaultConfig - Default configuration
   * @param {Object} userConfig - User provided configuration
   * @returns {Object} Merged configuration
   */
  mergeConfig(e, t) {
    const i = { ...e };
    for (const s in t)
      t.hasOwnProperty(s) && (typeof t[s] == "object" && t[s] !== null && typeof e[s] == "object" && e[s] !== null ? i[s] = this.mergeConfig(e[s], t[s]) : i[s] = t[s]);
    return i;
  }
  /**
   * Create the player markup structure
   * @param {HTMLElement} el - Original player element
   * @returns {HTMLElement} Complete player markup
   */
  createMarkup(e) {
    let t = e.getAttribute("id");
    t || (t = "chickenPlayer_" + Math.random().toString(36).substr(2, 9), e.setAttribute("id", t)), e.classList.add(this.config.classes.wrapper), e.classList.add("player--" + e.getAttribute("data-type"));
    const i = this.createObject(t), s = this.createCover(e), o = this.createButton();
    return e.appendChild(i), e.appendChild(s), s.appendChild(o), e;
  }
  createObject(e) {
    const t = document.createElement("div");
    return t.className = this.config.classes.object, t.setAttribute("id", e + "-object"), t;
  }
  /**
   * Create the player cover element
   * @param {HTMLElement} originalEl - Original player element
   * @returns {HTMLElement} Cover element
   */
  createCover(e) {
    const t = document.createElement("div");
    t.className = this.config.classes.cover;
    const i = e.querySelector("img");
    if (i)
      t.appendChild(i);
    else if (this.config.picture !== !1) {
      const s = document.createElement("img");
      s.src = this.config.picture.src, s.width = this.config.picture.width, s.height = this.config.picture.height, s.alt = "", s.setAttribute("loading", "lazy"), t.appendChild(s);
    }
    return t;
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
    const i = document.createElement("div");
    i.className = this.config.classes.buttonSpinner;
    for (let s = 0; s < 4; s++) {
      const o = document.createElement("div");
      i.appendChild(o);
    }
    return e.appendChild(t), e.appendChild(i), e;
  }
  /**
   * Bind event listeners to player elements
   * Only binds events to elements that haven't been initialized yet
   */
  bindEvents() {
    const e = this.config.selector, t = `.${this.config.classes.object}`, i = `.${this.config.classes.button}`, s = `.${this.config.classes.close}`;
    document.querySelectorAll(`${e}:not(.${this.config.classes.stateReady})`).forEach((o) => {
      const n = o.querySelector(t), c = o.querySelector(i), r = o.querySelector(s);
      if (!n || !c) {
        console.warn("Chicken Player: Required elements not found for player", o);
        return;
      }
      const y = o.getAttribute("data-type"), u = o.getAttribute("data-id"), v = n.getAttribute("id");
      c.addEventListener("click", () => {
        o.classList.add(this.config.classes.stateLoading), this.handlePlay(y, u, v);
      }), r && r.addEventListener("click", () => {
        o.classList.remove(this.config.classes.statePlaying), this.handleStop(y, u);
      }), o.classList.add(this.config.classes.stateReady);
    });
  }
  /**
   * Handle play action based on player type
   * @param {string} type - Player type (youtube, dailymotion, vimeo, html5)
   * @param {string} id - Video ID or URL
   * @param {string} uid - Player unique ID
   */
  handlePlay(e, t, i) {
    switch (e) {
      case "youtube":
        h.initPlayer(t, i, this.config);
        break;
      case "dailymotion":
        l.initPlayer(t, i, this.config);
        break;
      case "vimeo":
        d.initPlayer(t, i, this.config);
        break;
      case "html5":
        g.initPlayer(t, i, this.config);
        break;
      default:
        console.error("Unsupported player type:", e);
        break;
    }
  }
  /**
   * Play all players or a specific player
   * @param {string} [selector] - Optional CSS selector to target specific players
   */
  play(e = null) {
    const t = e || this.config.selector;
    document.querySelectorAll(t).forEach((s) => {
      const o = s.getAttribute("data-type"), n = s.getAttribute("data-id"), c = s.querySelector(`.${this.config.classes.object}`);
      if (o && n && c) {
        const r = c.getAttribute("id");
        s.classList.add(this.config.classes.stateLoading), this.handlePlay(o, n, r);
      }
    });
  }
  /**
   * Stop all players or a specific player
   * @param {string} [selector] - Optional CSS selector to target specific players
   */
  stop(e = null) {
    const t = e || this.config.selector;
    document.querySelectorAll(t).forEach((s) => {
      const o = s.getAttribute("data-type"), n = s.querySelector(`.${this.config.classes.object}`);
      if (o && n) {
        const c = n.getAttribute("id");
        s.classList.remove(this.config.classes.statePlaying), this.handleStop(o, c);
      }
    });
  }
  /**
   * Handle stop action based on player type
   * @param {string} type - Player type (youtube, dailymotion, vimeo, html5)
   * @param {string} uid - Player unique ID
   */
  handleStop(e, t) {
    switch (e) {
      case "youtube":
        h.stopPlayer(t);
        break;
      case "dailymotion":
        l.stopPlayer(t);
        break;
      case "vimeo":
        d.stopPlayer(t);
        break;
      case "html5":
        g.stopPlayer(t);
        break;
      default:
        console.error("Unsupported player type:", e);
        break;
    }
  }
}
export {
  E as default
};
