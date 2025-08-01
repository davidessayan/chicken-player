class p {
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
    this.apiReady ? this.attemptPlayer(t, e) : (this.tempPlayerUid = t, this.tempPlayerId = e, this.config = {
      needConsent: !1,
      ...s
    }, this.initApi());
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
class f extends p {
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
const c = new f();
window.dailymotion === void 0 && (window.dailymotion = {
  onScriptLoaded: () => {
    c.apiReady = !0, c.attemptPlayer(
      c.tempPlayerUid,
      c.tempPlayerId
    );
  }
});
class v extends p {
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
const r = new v();
window.onYouTubeIframeAPIReady = function() {
  r.apiReady = !0, r.attemptPlayer(
    r.tempPlayerUid,
    r.tempPlayerId
  );
};
class b extends p {
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
const l = new b();
window.onVimeoReadyCallback = function() {
  l.apiReady = !0, l.attemptPlayer(
    l.tempPlayerUid,
    l.tempPlayerId
  );
};
class P extends p {
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
      const s = document.createElement("video");
      s.id = e, s.className = "html5-player";
      const i = this.config.player.html5;
      s.controls = i.controls, s.preload = i.preload, s.autoplay = i.autoplay, s.loop = i.loop, s.muted = i.muted, s.width = i.width, s.height = i.height, s.setAttribute("playsinline", ""), s.setAttribute("webkit-playsinline", ""), i.poster && s.setAttribute("poster", i.poster), i.crossorigin && s.setAttribute("crossorigin", i.crossorigin), i.disablePictureInPicture && s.setAttribute("disablePictureInPicture", ""), i.disableRemotePlayback && s.setAttribute("disableRemotePlayback", ""), i.controlsList && s.setAttribute("controlsList", i.controlsList);
      const o = document.createElement("source");
      o.src = t, o.type = this.getVideoType(t), s.appendChild(o);
      const n = document.querySelector(`#${e}`);
      n && n.parentNode.replaceChild(s, n), this.videos[e] = s, this.onPlayerReady(e), this.onPlayerStateChange(e);
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
const u = new P();
class w {
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
    var e, t, s, i, o, n;
    (t = (e = this.config.player[this.playerType]) == null ? void 0 : e.cookies) != null && t.active && (this.needConsent = this.config.player[this.playerType].cookies.active, this.wrapper = document.querySelector(`.${this.config.classes.wrapper}.player--${this.playerType}`)), (i = (s = this.config.player[this.playerType]) == null ? void 0 : s.cookies) != null && i.eventConsent && (this.consentEvent = this.config.player[this.playerType].cookies.eventConsent), (n = (o = this.config.player[this.playerType]) == null ? void 0 : o.cookies) != null && n.eventReject && (this.rejectEvent = this.config.player[this.playerType].cookies.eventReject), this.consentState = !this.needConsent;
  }
  hasConsent() {
    return this.consentState;
  }
}
const k = {
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
    this.config = this.mergeConfig(k, e), typeof window < "u" && typeof document < "u" && this.init();
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
      new w(e, this.config);
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
    let t = e.getAttribute("id");
    t || (t = "chickenPlayer_" + Math.random().toString(36).substr(2, 9), e.setAttribute("id", t)), e.classList.add(this.config.classes.wrapper), e.classList.add("player--" + e.getAttribute("data-type"));
    const s = this.createObject(t), i = this.createCover(e), o = this.createButton();
    return e.appendChild(s), e.appendChild(i), i.appendChild(o), e;
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
    const s = e.querySelector("img");
    if (s)
      t.appendChild(s);
    else {
      const i = document.createElement("img");
      i.src = this.config.picture.src, i.width = this.config.picture.width, i.height = this.config.picture.height, i.alt = "", i.setAttribute("loading", "lazy"), t.appendChild(i);
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
    const e = this.config.selector, t = `.${this.config.classes.object}`, s = `.${this.config.classes.button}`, i = `.${this.config.classes.close}`;
    document.querySelectorAll(`${e}:not(.${this.config.classes.stateReady})`).forEach((o) => {
      const n = o.querySelector(t), h = o.querySelector(s), y = o.querySelector(i);
      if (!n || !h) {
        console.warn("Chicken Player: Required elements not found for player", o);
        return;
      }
      const d = o.getAttribute("data-type"), m = o.getAttribute("data-id"), g = n.getAttribute("id");
      h.addEventListener("click", () => {
        o.classList.add(this.config.classes.stateLoading), this.handlePlay(d, m, g);
      }), y && y.addEventListener("click", () => {
        o.classList.remove(this.config.classes.statePlaying), this.handleStop(d, m);
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
        r.initPlayer(t, s, this.config);
        break;
      case "dailymotion":
        c.initPlayer(t, s, this.config);
        break;
      case "vimeo":
        l.initPlayer(t, s, this.config);
        break;
      case "html5":
        u.initPlayer(t, s, this.config);
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
        r.stopPlayer(t);
        break;
      case "dailymotion":
        c.stopPlayer(t);
        break;
      case "vimeo":
        l.stopPlayer(t);
        break;
      case "html5":
        u.stopPlayer(t);
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
