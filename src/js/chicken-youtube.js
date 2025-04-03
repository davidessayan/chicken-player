const chickenYoutube = {
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
    tag.src = "//www.youtube.com/iframe_api";

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },

  createPlayer: function (uid, id) {
    console.log('createPlayer')
    if (!chickenYoutube.videos[uid]) {
      console.log('go')
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
      const player = document.querySelector('#' + uid);
      const wrapperSelector = `.${chickenYoutube.config.classes.wrapper}`;
      const wrapper = player.closest(wrapperSelector);

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

  attemptPlayer: function (uid, id) {
    console.log(uid, id)
    if (chickenYoutube.videos[uid]) {
      setTimeout(function () {
        chickenYoutube.startPlayer(uid);
      }, 1500);
    } else {
      chickenYoutube.createPlayer(uid, id);
    }
  },

  stopPlayer: function (uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenYoutube.config.events.stop);
    chickenYoutube.videos[uid].stopVideo();
  },

  startPlayer: function (uid) {
    document.querySelector('#' + uid).dispatchEvent(chickenYoutube.config.events.play);
    chickenYoutube.videos[uid].playVideo();
  }
};

export default chickenYoutube;

/* After Youtube API init */

window.onYouTubeIframeAPIReady = function () {
  chickenYoutube.apiReady = true;
  chickenYoutube.attemptPlayer(
    chickenYoutube.tempPlayerUid,
    chickenYoutube.tempPlayerId
  );
};
