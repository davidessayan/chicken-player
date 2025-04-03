const chickenVimeo = {
  apiReady: false,
  tempPlayerUid: null,
  tempPlayerId: null,

  videos: [],
  timers: [],

  config: {},

  initPlayer: function (id, uid, config) {
    if (!this.apiReady) {
      this.tempPlayerUid = uid;
      this.tempPlayerId = id;
      this.config = config;
      this.initApi();
    } else {
      this.attemptPlayer(uid, id);
    }
  },

  initApi: function () {
    const tag = document.createElement("script");
    tag.src = "//player.vimeo.com/api/player.js";
    tag.onload = onVimeoReadyCallback;

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },

  createPlayer: function (uid, id) {
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
      const player = document.querySelector('#' + uid);
      const wrapperSelector = `.${chickenVimeo.config.classes.wrapper}`;
      const wrapper = player.closest(wrapperSelector);

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
      const player = document.querySelector('#' + uid);

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

  attemptPlayer: function (uid, id) {
    console.log(uid, id)
    if (chickenVimeo.videos[uid]) {
      setTimeout(function () {
        chickenVimeo.startPlayer(uid);
      }, 1500);
    } else {
      chickenVimeo.createPlayer(uid, id);
    }
  },

  stopPlayer: function (uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenVimeo.config.events.stop);
    chickenVimeo.videos[uid].pause();
  },

  startPlayer: function (uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenVimeo.config.events.play);
    chickenVimeo.videos[uid].play();
  }
};

export default chickenVimeo;

/* After vimeo API init */

window.onVimeoReadyCallback = function () {
  chickenVimeo.apiReady = true;
  chickenVimeo.attemptPlayer(
    chickenVimeo.tempPlayerUid,
    chickenVimeo.tempPlayerId
  );
};
