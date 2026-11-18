class d {
  constructor() {
    this.apiReady = !1, this.apiLoading = !1, this.pendingPlayers = [], this.videos = {}, this.timers = {}, this.config = {};
  }
  /**
   * Initialize the player with configuration
   * @param {string} id - Video ID
   * @param {string} uid - Player unique ID
   * @param {Object} config - Player configuration
   */
  initPlayer(e, t, s) {
    this.config = {
      needConsent: !1,
      ...s
    }, this.apiReady ? this.attemptPlayer(t, e) : (this.queuePlayer(t, e), this.apiLoading || (this.apiLoading = !0, this.initApi() === !1 && (this.apiLoading = !1)));
  }
  /**
   * Queue player initialization while waiting for API readiness
   * @param {string} uid - Player unique ID
   * @param {string} id - Video ID
   */
  queuePlayer(e, t) {
    this.pendingPlayers.find((i) => i.uid === e) || this.pendingPlayers.push({ uid: e, id: t });
  }
  /**
   * Flush all pending players once API is ready
   */
  flushPendingPlayers() {
    const e = [...this.pendingPlayers];
    this.pendingPlayers = [], e.forEach(({ uid: t, id: s }) => {
      this.attemptPlayer(t, s);
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
    this.videos[e] ? this.startPlayer(e) : this.createPlayer(e, t);
  }
  /**
   * Stop the player
   * @param {string} uid - Player unique ID
   */
  stopPlayer(e) {
    this.videos[e] && (document.querySelector(`#${e}`).dispatchEvent(this.config.events.stop), this.videos[e].pause());
  }
  /**
   * Start the player
   * @param {string} uid - Player unique ID
   */
  startPlayer(e) {
    if (!this.videos[e]) return;
    document.querySelector(`#${e}`).dispatchEvent(this.config.events.play);
    const t = this.videos[e].play();
    t instanceof Promise && t.catch(() => {
    });
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
class w extends d {
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
    if (!this.videos[e]) {
      const { playerId: s, ...i } = this.config.player.dailymotion;
      dailymotion.createPlayer(e, { video: t, ...i }).then((o) => {
        this.videos[e] = o, this.onPlayerReady(e), this.onPlayerStateChange(e);
      }).catch((o) => console.error("Dailymotion player error:", o));
    }
  }
}
const h = new w();
if (window.dailymotion === void 0)
  window.dailymotion = {
    onScriptLoaded: () => {
      h.onApiReady();
    }
  };
else {
  const c = window.dailymotion.onScriptLoaded;
  window.dailymotion.onScriptLoaded = () => {
    typeof c == "function" && c(), h.onApiReady();
  };
}
class S extends d {
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
      ...this.config.player.youtube,
      height: this.config.player.height,
      width: this.config.player.width,
      videoId: t,
      events: {
        onReady: () => this.onPlayerReady(e),
        onStateChange: (s) => this.onYouTubeStateChange(e, s)
      }
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
    this.videos[e] && (document.querySelector(`#${e}`).dispatchEvent(this.config.events.stop), this.videos[e].stopVideo());
  }
  /**
   * Start the YouTube player
   * @param {string} uid - Player unique ID
   */
  startPlayer(e) {
    document.querySelector(`#${e}`).dispatchEvent(this.config.events.play), this.videos[e].playVideo();
  }
}
const u = new S(), g = window.onYouTubeIframeAPIReady;
window.onYouTubeIframeAPIReady = function() {
  typeof g == "function" && g(), u.onApiReady();
};
class k extends d {
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
      ...this.config.player.vimeo,
      height: this.config.player.height,
      width: this.config.player.width,
      id: t
    }), this.videos[e].ready().then(() => {
      this.onPlayerReady(e), this.onPlayerStateChange(e);
    }).catch((s) => console.error("Vimeo player error:", s)));
  }
}
const f = new k(), v = window.onVimeoReadyCallback;
window.onVimeoReadyCallback = function() {
  typeof v == "function" && v(), f.onApiReady();
};
class E extends d {
  /**
   * Initialize the HTML5 player
   * No API initialization needed for HTML5
   */
  initApi() {
    this.apiReady = !0, this.flushPendingPlayers();
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
      s.controls = i.controls, s.preload = i.preload, s.autoplay = i.autoplay, s.loop = i.loop, s.muted = i.muted, s.width = i.width, s.height = i.height, i.playsinline && (s.setAttribute("playsinline", ""), s.setAttribute("webkit-playsinline", "")), i.poster && s.setAttribute("poster", i.poster), i.crossorigin && s.setAttribute("crossorigin", i.crossorigin), i.disablePictureInPicture && s.setAttribute("disablePictureInPicture", ""), i.disableRemotePlayback && s.setAttribute("disableRemotePlayback", ""), i.controlsList && s.setAttribute("controlsList", i.controlsList);
      const o = document.createElement("source");
      o.src = t, o.type = this.getVideoType(t), s.appendChild(o);
      const n = document.querySelector(`#${e}`);
      if (n) {
        const a = n.parentNode.querySelector(":scope > template");
        a && a.content.querySelectorAll("track").forEach((r) => {
          s.appendChild(r.cloneNode());
        }), n.parentNode.replaceChild(s, n);
      }
      this.videos[e] = s, this.onPlayerReady(e), this.onPlayerStateChange(e);
    }
  }
  /**
   * Get video MIME type from URL
   * @param {string} url - Video URL
   * @returns {string} Video MIME type
   */
  getVideoType(e) {
    const t = e.split("?")[0].split(".").pop().toLowerCase();
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
    if (!this.videos[e]) return;
    document.querySelector(`#${e}`).dispatchEvent(this.config.events.stop), this.videos[e].pause();
  }
  /**
   * Start the HTML5 player
   * @param {string} uid - Player unique ID
   */
  startPlayer(e) {
    if (!this.videos[e]) return;
    document.querySelector(`#${e}`).dispatchEvent(this.config.events.play), this.videos[e].play().catch(() => {
    });
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
const b = new E();
class C {
  constructor(e, t) {
    this.consentState = !1, this.needConsent = t.cookies.active, this.consentEvent = t.cookies.eventConsent, this.rejectEvent = t.cookies.eventReject, this.consentState = !this.needConsent, this.config = t, this.playerType = e, this.wrappers = this.getWrappers(), this.setPlayerConsent(), this.wrappers.length && (this.needConsent && (this.setConsentMessage(), this.setWrapperState()), this.needConsent && this.consentEvent && window.addEventListener(this.consentEvent, () => {
      this.consentState = !0, this.setWrapperState();
    }), this.needConsent && this.rejectEvent && window.addEventListener(this.rejectEvent, () => {
      this.consentState = !1, this.setWrapperState();
    }));
  }
  /**
   * Players de ce type gérés par l'initialisation en cours : ceux du sélecteur de l'instance, pas encore liés
   * @returns {HTMLElement[]} Wrappers
   */
  getWrappers() {
    const { wrapper: e, stateReady: t } = this.config.classes;
    return [...document.querySelectorAll(this.config.selector)].filter(
      (s) => s.classList.contains(e) && s.classList.contains(`player--${this.playerType}`) && !s.classList.contains(t)
    );
  }
  setWrapperState() {
    this.wrappers.forEach((e) => {
      this.consentState ? e.classList.remove(this.config.classes.needConsent) : e.classList.add(this.config.classes.needConsent);
    });
  }
  setConsentMessage() {
    this.wrappers.forEach((e) => {
      const t = e.querySelector(`.${this.config.classes.cover}`);
      if (!t || t.querySelector(`.${this.config.classes.consentMessage}`)) return;
      const s = document.createElement("div");
      s.className = this.config.classes.consentMessage, s.innerHTML = `<p>${this.config.cookies.message}</p>`, t.appendChild(s);
    });
  }
  setPlayerConsent() {
    var e, t, s, i, o, n;
    (t = (e = this.config.player[this.playerType]) == null ? void 0 : e.cookies) != null && t.active && (this.needConsent = this.config.player[this.playerType].cookies.active), (i = (s = this.config.player[this.playerType]) == null ? void 0 : s.cookies) != null && i.eventConsent && (this.consentEvent = this.config.player[this.playerType].cookies.eventConsent), (n = (o = this.config.player[this.playerType]) == null ? void 0 : o.cookies) != null && n.eventReject && (this.rejectEvent = this.config.player[this.playerType].cookies.eventReject), this.consentState = !this.needConsent;
  }
  hasConsent() {
    return this.consentState;
  }
}
const L = {
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
    stateFocus: "player--focus",
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
    play: new Event("chickenPlayer.play", { bubbles: !0 }),
    stop: new Event("chickenPlayer.stop", { bubbles: !0 })
  },
  /* Cookie Consent */
  cookies: {
    active: !1,
    message: "Acceptez les cookies pour regarder cette vidéo.",
    eventConsent: "chickenPlayer.cookies.consent",
    eventReject: "chickenPlayer.cookies.reject",
    types: ["youtube", "dailymotion", "vimeo"]
  },
  /* Accessibility */
  a11y: {
    playLabel: "Lire la vidéo",
    closeLabel: "Fermer la vidéo",
    titleFormat: "{label} : {title}"
  }
};
class A {
  /**
   * Initialize a new Chicken Player instance
   * @param {Object} opts - User configuration options
   */
  constructor(e = {}) {
    this.config = this.mergeConfig(L, e), typeof window < "u" && typeof document < "u" && this.init();
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
      new C(e, this.config);
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
    for (const i of Object.keys(t))
      typeof t[i] == "object" && t[i] !== null && !Array.isArray(t[i]) && typeof e[i] == "object" && e[i] !== null && !Array.isArray(e[i]) ? s[i] = this.mergeConfig(e[i], t[i]) : s[i] = t[i];
    return s;
  }
  /**
   * Create the player markup structure
   * @param {HTMLElement} el - Original player element
   * @returns {HTMLElement} Complete player markup
   */
  createMarkup(e) {
    let t = e.getAttribute("id");
    t || (t = "chickenPlayer_" + Math.random().toString(36).slice(2, 11), e.setAttribute("id", t)), e.classList.add(this.config.classes.wrapper), e.classList.add("player--" + e.getAttribute("data-type"));
    const s = this.createObject(t), i = this.createCover(e), o = this.createButton(e.getAttribute("data-title"));
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
    else if (this.config.picture !== !1) {
      const i = document.createElement("img");
      i.src = this.config.picture.src, i.width = this.config.picture.width, i.height = this.config.picture.height, i.alt = "", i.setAttribute("loading", "lazy"), t.appendChild(i);
    }
    return t;
  }
  /**
   * Add the video title to a button label
   * @param {string} label - Button label
   * @param {string|null} title - Video title (data-title)
   * @returns {string} Label
   */
  formatLabel(e, t) {
    return t ? this.config.a11y.titleFormat.replace("{label}", () => e).replace("{title}", () => t) : e;
  }
  /**
   * Create the play button element
   * @param {string|null} title - Video title (data-title)
   * @returns {HTMLElement} Button element
   */
  createButton(e) {
    const t = document.createElement("button");
    t.type = "button", t.className = this.config.classes.button, t.setAttribute("aria-label", this.formatLabel(this.config.a11y.playLabel, e));
    const s = document.createElement("span");
    s.className = this.config.classes.buttonIcon;
    const i = document.createElement("div");
    i.className = this.config.classes.buttonSpinner;
    for (let o = 0; o < 4; o++) {
      const n = document.createElement("div");
      i.appendChild(n);
    }
    return t.appendChild(s), t.appendChild(i), t;
  }
  /**
   * Bind event listeners to player elements
   * Only binds events to elements that haven't been initialized yet
   */
  bindEvents() {
    const e = this.config.selector, t = `.${this.config.classes.object}`, s = `.${this.config.classes.button}`, i = `.${this.config.classes.close}`;
    document.querySelectorAll(`${e}:not(.${this.config.classes.stateReady})`).forEach((o) => {
      const n = o.querySelector(t), a = o.querySelector(s), r = o.querySelector(i);
      if (!n || !a) {
        console.warn("Chicken Player: Required elements not found for player", o);
        return;
      }
      const m = o.getAttribute("data-type"), P = o.getAttribute("data-id"), l = n.getAttribute("id"), p = o.getAttribute("data-title");
      a.addEventListener("click", () => {
        this.isWaitingConsent(o) || (o.classList.add(this.config.classes.stateLoading), this.handlePlay(m, P, l));
      }), r && (r.setAttribute("aria-label", this.formatLabel(this.config.a11y.closeLabel, p)), r.addEventListener("click", () => {
        o.classList.remove(this.config.classes.statePlaying), this.handleStop(m, l);
      })), this.bindFocus(o, l, a), p && o.addEventListener(this.config.events.play.type, () => {
        const y = this.getMediaTarget(l);
        y && y.setAttribute(y.matches("video") ? "aria-label" : "title", p);
      }), o.classList.add(this.config.classes.stateReady);
    });
  }
  /**
   * Get the focusable element of the media (iframe or video)
   * @param {string} uid - Player unique ID
   * @returns {HTMLElement|null} Media element
   */
  getMediaTarget(e) {
    const t = document.getElementById(e);
    return t ? t.matches("iframe, video") ? t : t.querySelector("iframe, video") : null;
  }
  /**
   * Keep keyboard focus on the visible layer: the media while playing, the cover otherwise
   * @param {HTMLElement} el - Player wrapper
   * @param {string} uid - Player unique ID
   * @param {HTMLElement} play - Play button
   */
  bindFocus(e, t, s) {
    const i = e.querySelector(`.${this.config.classes.cover}`);
    e.addEventListener(this.config.events.play.type, () => {
      const o = document.getElementById(t);
      if (o) {
        if (o.inert = !1, i.contains(document.activeElement)) {
          const n = document.activeElement.matches(":focus-visible"), a = this.getMediaTarget(t);
          a && (a.focus({ preventScroll: !0 }), n && document.activeElement === a && (e.classList.add(this.config.classes.stateFocus), a.addEventListener("blur", () => {
            e.classList.remove(this.config.classes.stateFocus);
          }, { once: !0 })));
        }
        i.inert = !0;
      }
    }), e.addEventListener(this.config.events.stop.type, () => {
      const o = document.getElementById(t);
      i.inert = !1, o && (o.contains(document.activeElement) && s.focus({ preventScroll: !0 }), o.inert = !0);
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
        u.initPlayer(t, s, this.config);
        break;
      case "dailymotion":
        h.initPlayer(t, s, this.config);
        break;
      case "vimeo":
        f.initPlayer(t, s, this.config);
        break;
      case "html5":
        b.initPlayer(t, s, this.config);
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
    document.querySelectorAll(t).forEach((i) => {
      const o = i.getAttribute("data-type"), n = i.getAttribute("data-id"), a = document.getElementById(`${i.id}-object`);
      if (o && n && a && !this.isWaitingConsent(i)) {
        const r = a.getAttribute("id");
        i.classList.add(this.config.classes.stateLoading), this.handlePlay(o, n, r);
      }
    });
  }
  /**
   * Check whether the player is waiting for cookie consent
   * @param {HTMLElement} el - Player wrapper
   * @returns {boolean} True if the video must not be loaded
   */
  isWaitingConsent(e) {
    return e.classList.contains(this.config.classes.needConsent);
  }
  /**
   * Stop all players or a specific player
   * @param {string} [selector] - Optional CSS selector to target specific players
   */
  stop(e = null) {
    const t = e || this.config.selector;
    document.querySelectorAll(t).forEach((i) => {
      const o = i.getAttribute("data-type"), n = document.getElementById(`${i.id}-object`);
      if (o && n) {
        const a = n.getAttribute("id");
        i.classList.remove(this.config.classes.statePlaying), this.handleStop(o, a);
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
        u.stopPlayer(t);
        break;
      case "dailymotion":
        h.stopPlayer(t);
        break;
      case "vimeo":
        f.stopPlayer(t);
        break;
      case "html5":
        b.stopPlayer(t);
        break;
      default:
        console.error("Unsupported player type:", e);
        break;
    }
  }
}
export {
  A as default
};
