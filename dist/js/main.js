/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/chicken-dailymotion.js":
/*!***************************************!*\
  !*** ./src/js/chicken-dailymotion.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var chickenDailymotion = {
  apiReady: false,
  tempPlayerUid: null,
  tempPlayerId: null,
  videos: [],
  timers: [],
  config: {},
  initPlayer: function initPlayer(id, uid, config) {
    if (!this.apiReady) {
      this.tempPlayerUid = uid;
      this.tempPlayerId = id;
      this.config = config;
      this.initApi();
    } else {
      this.attemptPlayer(uid, id);
    }
  },
  initApi: function initApi() {
    var tag = document.createElement("script");
    tag.src = "https://geo.dailymotion.com/libs/player/xa1ah.js";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },
  createPlayer: function createPlayer(uid, id) {
    if (!chickenDailymotion.videos[uid]) {
      dailymotion.createPlayer(uid, {
        video: id
      }).then(function (player) {
        chickenDailymotion.videos[uid] = player;
        onPlayerReady();
        onPlayerStateChange();
      });
    }
    function onPlayerReady() {
      var player = document.querySelector('#' + uid);
      var wrapperSelector = ".".concat(chickenDailymotion.config.classes.wrapper);
      var wrapper = player.closest(wrapperSelector);

      // Custom events for player state changes
      player.addEventListener('chickenPlayer.play', function () {
        console.log('play event');
        wrapper.classList.remove(chickenDailymotion.config.classes.stateLoading);
        wrapper.classList.add(chickenDailymotion.config.classes.statePlaying);
      });
      player.addEventListener('chickenPlayer.stop', function () {
        wrapper.classList.remove(chickenDailymotion.config.classes.statePlaying);
      });

      // Start the player
      chickenDailymotion.startPlayer(uid);
    }
    function onPlayerStateChange() {
      var player = document.querySelector('#' + uid);
      chickenDailymotion.videos[uid].on(dailymotion.events.VIDEO_PAUSE, function () {
        chickenDailymotion.timers[uid] = setTimeout(function () {
          player.dispatchEvent(chickenDailymotion.config.events.stop);
        }, 1000);
      });
      chickenDailymotion.videos[uid].on(dailymotion.events.VIDEO_PLAY, function () {
        clearTimeout(chickenDailymotion.timers[uid]);
        player.dispatchEvent(chickenDailymotion.config.events.play);
      });
    }
  },
  attemptPlayer: function attemptPlayer(uid, id) {
    console.log(uid, id);
    if (chickenDailymotion.videos[uid]) {
      setTimeout(function () {
        chickenDailymotion.startPlayer(uid);
      }, 1500);
    } else {
      chickenDailymotion.createPlayer(uid, id);
    }
  },
  stopPlayer: function stopPlayer(uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenDailymotion.config.events.stop);
    chickenDailymotion.videos[uid].pause();
  },
  startPlayer: function startPlayer(uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenDailymotion.config.events.play);
    chickenDailymotion.videos[uid].play();
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (chickenDailymotion);

/* Dailymotion API init */

if (window.dailymotion === undefined) {
  window.dailymotion = {
    onScriptLoaded: function onScriptLoaded() {
      chickenDailymotion.apiReady = true;
      chickenDailymotion.attemptPlayer(chickenDailymotion.tempPlayerUid, chickenDailymotion.tempPlayerId);
    }
  };
}

/***/ }),

/***/ "./src/js/chicken-init.js":
/*!********************************!*\
  !*** ./src/js/chicken-init.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _chicken_dailymotion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chicken-dailymotion */ "./src/js/chicken-dailymotion.js");
/* harmony import */ var _chicken_youtube__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chicken-youtube */ "./src/js/chicken-youtube.js");
/* harmony import */ var _chicken_vimeo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chicken-vimeo */ "./src/js/chicken-vimeo.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var chickenPlayer = {
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
      height: 400
    },
    events: {
      play: new Event('chickenPlayer.play'),
      stop: new Event('chickenPlayer.stop')
    }
  },
  init: function init() {
    var _this = this;
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // Merge opts and config
    this.config = this.mergeConfig(this.config, opts);
    document.querySelectorAll(this.config.selector).forEach(function (el) {
      var markup = _this.markup(el);
      el.parentNode.replaceChild(markup, el);
    });
    this.bind();
  },
  // Helper function to deep merge config objects
  mergeConfig: function mergeConfig(defaultConfig, userConfig) {
    var merged = _objectSpread({}, defaultConfig);
    for (var key in userConfig) {
      if (userConfig.hasOwnProperty(key)) {
        // If both objects have the same key and both values are objects, merge them
        if (_typeof(userConfig[key]) === 'object' && userConfig[key] !== null && _typeof(defaultConfig[key]) === 'object' && defaultConfig[key] !== null) {
          merged[key] = this.mergeConfig(defaultConfig[key], userConfig[key]);
        } else {
          // Otherwise just override with user value
          merged[key] = userConfig[key];
        }
      }
    }
    return merged;
  },
  markup: function markup(el) {
    // Create the outer wrapper
    var wrapper = document.createElement('div');
    wrapper.className = this.config.classes.wrapper;

    // Clone the original element to avoid removing it from its current position
    var playerClone = el.cloneNode(true);

    // Create the player cover
    var playerCover = document.createElement('div');
    playerCover.className = this.config.classes.cover;

    // Create the image
    var coverImage = document.createElement('img');
    coverImage.src = this.config.picture.src;
    coverImage.width = this.config.picture.width;
    coverImage.height = this.config.picture.height;
    coverImage.alt = '';
    coverImage.setAttribute('loading', 'lazy');

    // Create the button
    var coverButton = document.createElement('button');
    coverButton.type = 'button';
    coverButton.className = this.config.classes.button;

    // Create the play icon
    var playIcon = document.createElement('span');
    playIcon.className = this.config.classes.buttonIcon;

    // Create the spinner
    var buttonSpinner = document.createElement('div');
    buttonSpinner.className = this.config.classes.buttonSpinner;

    // Create spinner divs
    for (var i = 0; i < 4; i++) {
      var spinnerDiv = document.createElement('div');
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
  bind: function bind() {
    var _this2 = this;
    // Construct selectors based on config
    var wrapperSelector = ".".concat(this.config.classes.wrapper);
    var playerSelector = this.config.selector;
    var playSelector = ".".concat(this.config.classes.button);
    var closeSelector = ".".concat(this.config.classes.close); // Utilisation de la classe close depuis la config

    document.querySelectorAll(wrapperSelector).forEach(function (el) {
      var player = el.querySelector(playerSelector);
      var play = el.querySelector(playSelector);
      var close = el.querySelector(closeSelector);
      var type = player.getAttribute('data-type');
      var id = player.getAttribute('data-id');
      var uid = player.getAttribute('id');

      // Click handlers
      play.addEventListener('click', function () {
        el.classList.add(_this2.config.classes.stateLoading);
        switch (type) {
          case 'youtube':
            _chicken_youtube__WEBPACK_IMPORTED_MODULE_1__["default"].initPlayer(id, uid, _this2.config);
            break;
          case 'dailymotion':
            _chicken_dailymotion__WEBPACK_IMPORTED_MODULE_0__["default"].initPlayer(id, uid, _this2.config);
            break;
          case 'vimeo':
            _chicken_vimeo__WEBPACK_IMPORTED_MODULE_2__["default"].initPlayer(id, uid, _this2.config);
            break;
          default:
            console.error('Type de player non supporté');
            break;
        }
      });
      if (close) {
        close.addEventListener('click', function () {
          el.classList.remove(_this2.config.classes.statePlaying);
          switch (type) {
            case 'youtube':
              _chicken_youtube__WEBPACK_IMPORTED_MODULE_1__["default"].stopPlayer(id);
              break;
            case 'dailymotion':
              _chicken_dailymotion__WEBPACK_IMPORTED_MODULE_0__["default"].stopPlayer(id);
              break;
            case 'vimeo':
              _chicken_vimeo__WEBPACK_IMPORTED_MODULE_2__["default"].stopPlayer(id);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (chickenPlayer);

/***/ }),

/***/ "./src/js/chicken-vimeo.js":
/*!*********************************!*\
  !*** ./src/js/chicken-vimeo.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var chickenVimeo = {
  apiReady: false,
  tempPlayerUid: null,
  tempPlayerId: null,
  videos: [],
  timers: [],
  config: {},
  initPlayer: function initPlayer(id, uid, config) {
    if (!this.apiReady) {
      this.tempPlayerUid = uid;
      this.tempPlayerId = id;
      this.config = config;
      this.initApi();
    } else {
      this.attemptPlayer(uid, id);
    }
  },
  initApi: function initApi() {
    var tag = document.createElement("script");
    tag.src = "//player.vimeo.com/api/player.js";
    tag.onload = onVimeoReadyCallback;
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },
  createPlayer: function createPlayer(uid, id) {
    if (!chickenVimeo.videos[uid]) {
      chickenVimeo.videos[uid] = new Vimeo.Player(uid, {
        height: 170,
        width: 300,
        id: id,
        autoplay: true
      });
      onPlayerReady();
      onPlayerStateChange();
    }
    function onPlayerReady() {
      var player = document.querySelector('#' + uid);
      var wrapperSelector = ".".concat(chickenVimeo.config.classes.wrapper);
      var wrapper = player.closest(wrapperSelector);

      // Custom events for player state changes
      player.addEventListener('chickenPlayer.play', function () {
        console.log('play event');
        wrapper.classList.remove(chickenVimeo.config.classes.stateLoading);
        wrapper.classList.add(chickenVimeo.config.classes.statePlaying);
      });
      player.addEventListener('chickenPlayer.stop', function () {
        wrapper.classList.remove(chickenVimeo.config.classes.statePlaying);
      });

      // Start the player
      chickenVimeo.startPlayer(uid);
    }
    function onPlayerStateChange(event) {
      var player = document.querySelector('#' + uid);
      chickenVimeo.videos[uid].on('pause', function () {
        chickenVimeo.timers[uid] = setTimeout(function () {
          player.dispatchEvent(chickenVimeo.config.events.stop);
        }, 1000);
      });
      chickenVimeo.videos[uid].on('play', function () {
        clearTimeout(chickenVimeo.timers[uid]);
        player.dispatchEvent(chickenVimeo.config.events.play);
      });
    }
  },
  attemptPlayer: function attemptPlayer(uid, id) {
    console.log(uid, id);
    if (chickenVimeo.videos[uid]) {
      setTimeout(function () {
        chickenVimeo.startPlayer(uid);
      }, 1500);
    } else {
      chickenVimeo.createPlayer(uid, id);
    }
  },
  stopPlayer: function stopPlayer(uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenVimeo.config.events.stop);
    chickenVimeo.videos[uid].pause();
  },
  startPlayer: function startPlayer(uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenVimeo.config.events.play);
    chickenVimeo.videos[uid].play();
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (chickenVimeo);

/* After vimeo API init */

window.onVimeoReadyCallback = function () {
  chickenVimeo.apiReady = true;
  chickenVimeo.attemptPlayer(chickenVimeo.tempPlayerUid, chickenVimeo.tempPlayerId);
};

/***/ }),

/***/ "./src/js/chicken-youtube.js":
/*!***********************************!*\
  !*** ./src/js/chicken-youtube.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var chickenYoutube = {
  apiReady: false,
  tempPlayerUid: null,
  tempPlayerId: null,
  videos: [],
  timers: [],
  config: {},
  initPlayer: function initPlayer(id, uid, config) {
    if (!this.apiReady) {
      this.tempPlayerUid = uid;
      this.tempPlayerId = id;
      this.config = config;
      this.initApi();
    } else {
      this.attemptPlayer(uid, id);
    }
  },
  initApi: function initApi() {
    var tag = document.createElement("script");
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },
  createPlayer: function createPlayer(uid, id) {
    console.log('createPlayer');
    if (!chickenYoutube.videos[uid]) {
      console.log('go');
      chickenYoutube.videos[uid] = new YT.Player(uid, {
        height: "169",
        width: "300",
        videoId: id,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          modestbranding: 1,
          showinfo: 0,
          controls: 1,
          iv_load_policy: 3,
          fs: 1
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    }
    function onPlayerReady() {
      var player = document.querySelector('#' + uid);
      var wrapperSelector = ".".concat(chickenYoutube.config.classes.wrapper);
      var wrapper = player.closest(wrapperSelector);

      // Custom events for player state changes
      player.addEventListener('chickenPlayer.play', function () {
        console.log('play event');
        wrapper.classList.remove(chickenYoutube.config.classes.stateLoading);
        wrapper.classList.add(chickenYoutube.config.classes.statePlaying);
      });
      player.addEventListener('chickenPlayer.stop', function () {
        wrapper.classList.remove(chickenYoutube.config.classes.statePlaying);
      });

      // Start the player
      chickenYoutube.startPlayer(uid);
    }
    function onPlayerStateChange(event) {
      if (event.data == 0 || event.data == 2) {
        chickenYoutube.timers[uid] = setTimeout(function () {
          document.querySelector('#' + uid).dispatchEvent(chickenYoutube.config.events.stop);
        }, 1000);
      }
      if (event.data == 1) {
        console.log('play', document.querySelector('#' + uid));
        clearTimeout(chickenYoutube.timers[uid]);
        document.querySelector('#' + uid).dispatchEvent(chickenYoutube.config.events.play);
      }
    }
  },
  attemptPlayer: function attemptPlayer(uid, id) {
    console.log(uid, id);
    if (chickenYoutube.videos[uid]) {
      setTimeout(function () {
        chickenYoutube.startPlayer(uid);
      }, 1500);
    } else {
      chickenYoutube.createPlayer(uid, id);
    }
  },
  stopPlayer: function stopPlayer(uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenYoutube.config.events.stop);
    chickenYoutube.videos[uid].stopVideo();
  },
  startPlayer: function startPlayer(uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenYoutube.config.events.play);
    chickenYoutube.videos[uid].playVideo();
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (chickenYoutube);

/* After Youtube API init */

window.onYouTubeIframeAPIReady = function () {
  chickenYoutube.apiReady = true;
  chickenYoutube.attemptPlayer(chickenYoutube.tempPlayerUid, chickenYoutube.tempPlayerId);
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _chicken_init__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chicken-init */ "./src/js/chicken-init.js");

var chickenPlayer = function chickenPlayer() {
  _chicken_init__WEBPACK_IMPORTED_MODULE_0__["default"].init();
};
window.chickenPlayer = chickenPlayer;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (chickenPlayer);
})();

// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!****************************!*\
  !*** ./src/scss/main.scss ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=main.js.map