const chickenDailymotion = {
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
    tag.src = "https://geo.dailymotion.com/libs/player/xa1ah.js";

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },

  createPlayer: function (uid, id) {
    if (!chickenDailymotion.videos[uid]) {
      dailymotion
        .createPlayer(uid, {
          video: id
        })
        .then((player) => {
          chickenDailymotion.videos[uid] = player;

          onPlayerReady();
          onPlayerStateChange();
        });
    }

    function onPlayerReady() {
      const player = document.querySelector('#' + uid);
      const wrapperSelector = `.${chickenDailymotion.config.classes.wrapper}`;
      const wrapper = player.closest(wrapperSelector);

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
      const player = document.querySelector('#' + uid);

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

  attemptPlayer: function (uid, id) {
    console.log(uid, id)
    if (chickenDailymotion.videos[uid]) {
      setTimeout(function () {
        chickenDailymotion.startPlayer(uid);
      }, 1500);
    } else {
      chickenDailymotion.createPlayer(uid, id);
    }
  },

  stopPlayer: function (uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenDailymotion.config.events.stop);
    chickenDailymotion.videos[uid].pause();
  },

  startPlayer: function (uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenDailymotion.config.events.play);
    chickenDailymotion.videos[uid].play();
  }
};

export default chickenDailymotion;

/* Dailymotion API init */

if (window.dailymotion === undefined) {
  window.dailymotion = {
    onScriptLoaded: () => {
      chickenDailymotion.apiReady = true;
      chickenDailymotion.attemptPlayer(
        chickenDailymotion.tempPlayerUid,
        chickenDailymotion.tempPlayerId
      );
    }
  };
}
