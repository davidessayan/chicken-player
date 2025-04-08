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
/* harmony import */ var _chicken_player_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chicken-player-base */ "./src/js/chicken-player-base.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * Chicken Player - Dailymotion Implementation
 * @author David Essayan
 * @version 1.0.0
 * @description Dailymotion video player implementation
 */


var ChickenDailymotion = /*#__PURE__*/function (_ChickenPlayerBase) {
  function ChickenDailymotion() {
    _classCallCheck(this, ChickenDailymotion);
    return _callSuper(this, ChickenDailymotion, arguments);
  }
  _inherits(ChickenDailymotion, _ChickenPlayerBase);
  return _createClass(ChickenDailymotion, [{
    key: "initApi",
    value:
    /**
     * Initialize the Dailymotion API
     */
    function initApi() {
      if (!this.config.player.dailymotion.playerId) {
        console.error('Dailymotion player ID is not set');
        return false;
      }
      var tag = document.createElement("script");
      tag.src = "https://geo.dailymotion.com/libs/player/".concat(this.config.player.dailymotion.playerId, ".js");
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    /**
     * Create a new Dailymotion player instance
     * @param {string} uid - Player unique ID
     * @param {string} id - Video ID
     */
  }, {
    key: "createPlayer",
    value: function createPlayer(uid, id) {
      var _this = this;
      if (!this.videos[uid]) {
        dailymotion.createPlayer(uid, _objectSpread(_objectSpread({}, {
          video: id
        }), this.config.player.dailymotion)).then(function (player) {
          _this.videos[uid] = player;
          _this.onPlayerReady(uid);
          _this.onPlayerStateChange(uid);
        });
      }
    }
  }]);
}(_chicken_player_base__WEBPACK_IMPORTED_MODULE_0__["default"]);
var chickenDailymotion = new ChickenDailymotion();
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

/***/ "./src/js/chicken-player-base.js":
/*!***************************************!*\
  !*** ./src/js/chicken-player-base.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Chicken Player Base Class
 * @author David Essayan
 * @version 1.0.0
 * @description Base class for video player implementations
 */
var ChickenPlayerBase = /*#__PURE__*/function () {
  function ChickenPlayerBase() {
    _classCallCheck(this, ChickenPlayerBase);
    this.apiReady = false;
    this.tempPlayerUid = null;
    this.tempPlayerId = null;
    this.videos = [];
    this.timers = [];
    this.config = {};
  }

  /**
   * Initialize the player with configuration
   * @param {string} id - Video ID
   * @param {string} uid - Player unique ID
   * @param {Object} config - Player configuration
   */
  return _createClass(ChickenPlayerBase, [{
    key: "initPlayer",
    value: function initPlayer(id, uid, config) {
      if (!this.apiReady) {
        this.tempPlayerUid = uid;
        this.tempPlayerId = id;
        this.config = config;
        this.initApi();
      } else {
        this.attemptPlayer(uid, id);
      }
    }

    /**
     * Initialize the video API
     * @abstract
     */
  }, {
    key: "initApi",
    value: function initApi() {
      throw new Error('initApi must be implemented by child class');
    }

    /**
     * Create a new player instance
     * @param {string} uid - Player unique ID
     * @param {string} id - Video ID
     * @abstract
     */
  }, {
    key: "createPlayer",
    value: function createPlayer(uid, id) {
      throw new Error('createPlayer must be implemented by child class');
    }

    /**
     * Attempt to create or start the player
     * @param {string} uid - Player unique ID
     * @param {string} id - Video ID
     */
  }, {
    key: "attemptPlayer",
    value: function attemptPlayer(uid, id) {
      var _this = this;
      if (this.videos[uid]) {
        setTimeout(function () {
          _this.startPlayer(uid);
        }, 1500);
      } else {
        this.createPlayer(uid, id);
      }
    }

    /**
     * Stop the player
     * @param {string} uid - Player unique ID
     */
  }, {
    key: "stopPlayer",
    value: function stopPlayer(uid) {
      document.querySelector("#".concat(uid)).dispatchEvent(this.config.events.stop);
      this.videos[uid].pause();
    }

    /**
     * Start the player
     * @param {string} uid - Player unique ID
     */
  }, {
    key: "startPlayer",
    value: function startPlayer(uid) {
      document.querySelector("#".concat(uid)).dispatchEvent(this.config.events.play);
      this.videos[uid].play();
    }

    /**
     * Handle player ready state
     * @param {string} uid - Player unique ID
     */
  }, {
    key: "onPlayerReady",
    value: function onPlayerReady(uid) {
      var _this2 = this;
      var player = document.querySelector("#".concat(uid));
      var wrapperSelector = ".".concat(this.config.classes.wrapper);
      var wrapper = player.closest(wrapperSelector);
      player.addEventListener('chickenPlayer.play', function () {
        wrapper.classList.remove(_this2.config.classes.stateLoading);
        wrapper.classList.add(_this2.config.classes.statePlaying);
      });
      player.addEventListener('chickenPlayer.stop', function () {
        wrapper.classList.remove(_this2.config.classes.statePlaying);
      });
      this.startPlayer(uid);
    }

    /**
     * Handle player state changes
     * @param {string} uid - Player unique ID
     */
  }, {
    key: "onPlayerStateChange",
    value: function onPlayerStateChange(uid) {
      var _this3 = this;
      var player = document.querySelector("#".concat(uid));
      this.videos[uid].on('pause', function () {
        _this3.timers[uid] = setTimeout(function () {
          player.dispatchEvent(_this3.config.events.stop);
        }, 1000);
      });
      this.videos[uid].on('play', function () {
        clearTimeout(_this3.timers[uid]);
        player.dispatchEvent(_this3.config.events.play);
      });
    }
  }]);
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChickenPlayerBase);

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
/* harmony import */ var _chicken_player_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chicken-player-base */ "./src/js/chicken-player-base.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * Chicken Player - Vimeo Implementation
 * @author David Essayan
 * @version 1.0.0
 * @description Vimeo video player implementation
 */


var ChickenVimeo = /*#__PURE__*/function (_ChickenPlayerBase) {
  function ChickenVimeo() {
    _classCallCheck(this, ChickenVimeo);
    return _callSuper(this, ChickenVimeo, arguments);
  }
  _inherits(ChickenVimeo, _ChickenPlayerBase);
  return _createClass(ChickenVimeo, [{
    key: "initApi",
    value:
    /**
     * Initialize the Vimeo API
     */
    function initApi() {
      var tag = document.createElement("script");
      tag.src = "//player.vimeo.com/api/player.js";
      tag.onload = onVimeoReadyCallback;
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    /**
     * Create a new Vimeo player instance
     * @param {string} uid - Player unique ID
     * @param {string} id - Video ID
     */
  }, {
    key: "createPlayer",
    value: function createPlayer(uid, id) {
      if (!this.videos[uid]) {
        this.videos[uid] = new Vimeo.Player(uid, _objectSpread(_objectSpread({}, {
          height: this.config.player.height,
          width: this.config.player.width,
          id: id
        }), this.config.player.vimeo));
        this.onPlayerReady(uid);
        this.onPlayerStateChange(uid);
      }
    }
  }]);
}(_chicken_player_base__WEBPACK_IMPORTED_MODULE_0__["default"]);
var chickenVimeo = new ChickenVimeo();
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
/* harmony import */ var _chicken_player_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chicken-player-base */ "./src/js/chicken-player-base.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * Chicken Player - YouTube Implementation
 * @author David Essayan
 * @version 1.0.0
 * @description YouTube video player implementation
 */


var ChickenYoutube = /*#__PURE__*/function (_ChickenPlayerBase) {
  function ChickenYoutube() {
    _classCallCheck(this, ChickenYoutube);
    return _callSuper(this, ChickenYoutube, arguments);
  }
  _inherits(ChickenYoutube, _ChickenPlayerBase);
  return _createClass(ChickenYoutube, [{
    key: "initApi",
    value:
    /**
     * Initialize the YouTube API
     */
    function initApi() {
      var tag = document.createElement("script");
      tag.src = "//www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    /**
     * Create a new YouTube player instance
     * @param {string} uid - Player unique ID
     * @param {string} id - Video ID
     */
  }, {
    key: "createPlayer",
    value: function createPlayer(uid, id) {
      var _this = this;
      if (!this.videos[uid]) {
        this.videos[uid] = new YT.Player(uid, _objectSpread(_objectSpread({}, {
          height: this.config.player.height,
          width: this.config.player.width,
          videoId: id,
          host: this.config.player.youtube.host,
          events: {
            onReady: function onReady() {
              return _this.onPlayerReady(uid);
            },
            onStateChange: function onStateChange(event) {
              return _this.onYouTubeStateChange(uid, event);
            }
          }
        }), this.config.player.youtube));
      }
    }

    /**
     * Handle YouTube specific state changes
     * @param {string} uid - Player unique ID
     * @param {Object} event - YouTube player event
     */
  }, {
    key: "onYouTubeStateChange",
    value: function onYouTubeStateChange(uid, event) {
      var _this2 = this;
      var player = document.querySelector("#".concat(uid));
      if (event.data === 0 || event.data === 2) {
        this.timers[uid] = setTimeout(function () {
          player.dispatchEvent(_this2.config.events.stop);
        }, 1000);
      }
      if (event.data === 1) {
        clearTimeout(this.timers[uid]);
        player.dispatchEvent(this.config.events.play);
      }
    }

    /**
     * Stop the YouTube player
     * @param {string} uid - Player unique ID
     */
  }, {
    key: "stopPlayer",
    value: function stopPlayer(uid) {
      document.querySelector("#".concat(uid)).dispatchEvent(this.config.events.stop);
      this.videos[uid].stopVideo();
    }

    /**
     * Start the YouTube player
     * @param {string} uid - Player unique ID
     */
  }, {
    key: "startPlayer",
    value: function startPlayer(uid) {
      document.querySelector("#".concat(uid)).dispatchEvent(this.config.events.play);
      this.videos[uid].playVideo();
    }
  }]);
}(_chicken_player_base__WEBPACK_IMPORTED_MODULE_0__["default"]);
var chickenYoutube = new ChickenYoutube();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (chickenYoutube);

/* After YouTube API init */
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
/* harmony import */ var _chicken_dailymotion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chicken-dailymotion */ "./src/js/chicken-dailymotion.js");
/* harmony import */ var _chicken_youtube__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chicken-youtube */ "./src/js/chicken-youtube.js");
/* harmony import */ var _chicken_vimeo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chicken-vimeo */ "./src/js/chicken-vimeo.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Chicken Player - Main Initialization
 * @author David Essayan
 * @version 1.0.0
 * @description Main initialization file for the Chicken Player library
 */





/**
 * Default configuration for the player
 * @type {Object}
 */
var defaultConfig = {
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
      loop: false
    },
    /* Dailymotion defaults */
    /* See: https://developers.dailymotion.com/guides/getting-started-with-web-sdk/ */
    dailymotion: {
      playerId: null,
      params: {
        startTime: 0,
        scaleMode: 'fit',
        loop: false,
        mute: false
      }
    }
  },
  classes: {
    wrapper: 'cbo-chickenplayer',
    cover: 'chicken-cover',
    button: 'cover-button',
    buttonIcon: 'button-icon',
    buttonSpinner: 'button-spinner',
    close: 'player-close',
    stateInit: 'player--init',
    statePlaying: 'player--playing',
    stateLoading: 'player--loading',
    stateError: 'player--error'
  },
  placeholder: {
    src: 'https://placehold.co/600x400',
    width: 600,
    height: 400
  },
  events: {
    play: new Event('chickenPlayer.play'),
    stop: new Event('chickenPlayer.stop')
  }
};

/**
 * Main Chicken Player class
 */
var ChickenPlayer = /*#__PURE__*/function () {
  /**
   * Initialize a new Chicken Player instance
   * @param {Object} opts - User configuration options
   */
  function ChickenPlayer() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, ChickenPlayer);
    this.config = this.mergeConfig(defaultConfig, opts);
    this.init();
  }

  /**
   * Initialize the player with the current configuration
   */
  return _createClass(ChickenPlayer, [{
    key: "init",
    value: function init() {
      var _this = this;
      document.querySelectorAll(".".concat(this.config.classes.wrapper)).forEach(function (el) {
        // Generate or get player ID
        var uid = el.getAttribute('data-uid') || _this.generateUniqueId();

        // Create chicken-player element
        var playerEl = document.createElement('div');
        playerEl.className = 'chicken-player'; // Use a fixed class name instead of selector
        playerEl.id = uid;
        playerEl.setAttribute('data-type', el.getAttribute('data-type'));
        playerEl.setAttribute('data-id', el.getAttribute('data-id'));

        // Create markup
        var markup = _this.createMarkup(el, playerEl);

        // Replace original element with new markup
        el.parentNode.replaceChild(markup, el);
      });
      this.bindEvents();

      // Add init state class to all players
      document.querySelectorAll(".".concat(this.config.classes.wrapper)).forEach(function (el) {
        el.classList.add(_this.config.classes.stateInit);
      });
    }

    /**
     * Generate a unique ID for player elements
     * @returns {string} Unique ID
     */
  }, {
    key: "generateUniqueId",
    value: function generateUniqueId() {
      return 'player_' + Math.random().toString(36).substring(2, 15);
    }

    /**
     * Deep merge two configuration objects
     * @param {Object} defaultConfig - Default configuration
     * @param {Object} userConfig - User provided configuration
     * @returns {Object} Merged configuration
     */
  }, {
    key: "mergeConfig",
    value: function mergeConfig(defaultConfig, userConfig) {
      var merged = _objectSpread({}, defaultConfig);
      for (var key in userConfig) {
        if (userConfig.hasOwnProperty(key)) {
          if (_typeof(userConfig[key]) === 'object' && userConfig[key] !== null && _typeof(defaultConfig[key]) === 'object' && defaultConfig[key] !== null) {
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
     * @param {HTMLElement} el - Original wrapper element
     * @param {HTMLElement} playerEl - Player element to be inserted
     * @returns {HTMLElement} Complete player markup
     */
  }, {
    key: "createMarkup",
    value: function createMarkup(el, playerEl) {
      // Create wrapper (clone the original)
      var wrapper = el.cloneNode(false);

      // Create cover elements
      var cover = this.createCover(el);
      var button = this.createButton();

      // Assemble structure
      wrapper.appendChild(playerEl);
      wrapper.appendChild(cover);
      cover.appendChild(button);
      return wrapper;
    }

    /**
     * Create the player cover element
     * @param {HTMLElement} el - Original player element
     * @returns {HTMLElement} Cover element
     */
  }, {
    key: "createCover",
    value: function createCover(el) {
      var cover = document.createElement('div');
      cover.className = this.config.classes.cover;
      var image = document.createElement('img');

      // Get image from original element if it exists
      var originalImage = el.querySelector('img');
      if (originalImage) {
        image.src = originalImage.src;
        image.width = originalImage.width || this.config.placeholder.width;
        image.height = originalImage.height || this.config.placeholder.height;
        image.alt = originalImage.alt || '';
      } else {
        // Fallback to default configuration
        image.src = this.config.placeholder.src;
        image.width = this.config.placeholder.width;
        image.height = this.config.placeholder.height;
        image.alt = '';
      }
      image.setAttribute('loading', 'lazy');
      cover.appendChild(image);
      return cover;
    }

    /**
     * Create the play button element
     * @returns {HTMLElement} Button element
     */
  }, {
    key: "createButton",
    value: function createButton() {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = this.config.classes.button;
      var icon = document.createElement('span');
      icon.className = this.config.classes.buttonIcon;
      var spinner = document.createElement('div');
      spinner.className = this.config.classes.buttonSpinner;

      // Create spinner divs
      for (var i = 0; i < 4; i++) {
        var spinnerDiv = document.createElement('div');
        spinner.appendChild(spinnerDiv);
      }
      button.appendChild(icon);
      button.appendChild(spinner);
      return button;
    }

    /**
     * Bind event listeners to player elements
     */
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this2 = this;
      var wrapperSelector = ".".concat(this.config.classes.wrapper);
      var playerSelector = '.chicken-player'; // Use a fixed class name instead of selector
      var playSelector = ".".concat(this.config.classes.button);
      var closeSelector = ".".concat(this.config.classes.close);
      document.querySelectorAll(wrapperSelector).forEach(function (el) {
        var player = el.querySelector(playerSelector);
        var play = el.querySelector(playSelector);
        var close = el.querySelector(closeSelector);
        var type = player.getAttribute('data-type');
        var id = player.getAttribute('data-id');
        var uid = player.id;

        // Play button click handler
        play.addEventListener('click', function () {
          el.classList.add(_this2.config.classes.stateLoading);
          _this2.handlePlay(type, id, uid);
        });

        // Close button click handler
        if (close) {
          close.addEventListener('click', function () {
            el.classList.remove(_this2.config.classes.statePlaying);
            _this2.handleStop(type, id);
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
  }, {
    key: "handlePlay",
    value: function handlePlay(type, id, uid) {
      switch (type) {
        case 'youtube':
          _chicken_youtube__WEBPACK_IMPORTED_MODULE_1__["default"].initPlayer(id, uid, this.config);
          break;
        case 'dailymotion':
          _chicken_dailymotion__WEBPACK_IMPORTED_MODULE_0__["default"].initPlayer(id, uid, this.config);
          break;
        case 'vimeo':
          _chicken_vimeo__WEBPACK_IMPORTED_MODULE_2__["default"].initPlayer(id, uid, this.config);
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
  }, {
    key: "handleStop",
    value: function handleStop(type, id) {
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
          console.error('Unsupported player type:', type);
          break;
      }
    }
  }]);
}(); // Expose ChickenPlayer globally for direct browser usage
if (typeof window !== 'undefined') {
  window.ChickenPlayer = ChickenPlayer;
}

// Export for ES6 modules
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChickenPlayer);
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