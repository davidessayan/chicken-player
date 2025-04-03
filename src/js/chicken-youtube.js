/**
 * Chicken Player - YouTube Implementation
 * @author David Essayan
 * @version 1.0.0
 * @description YouTube video player implementation
 */

import ChickenPlayerBase from './chicken-player-base';

class ChickenYoutube extends ChickenPlayerBase {
  /**
   * Initialize the YouTube API
   */
  initApi() {
    const tag = document.createElement("script");
    tag.src = "//www.youtube.com/iframe_api";

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  /**
   * Create a new YouTube player instance
   * @param {string} uid - Player unique ID
   * @param {string} id - Video ID
   */
  createPlayer(uid, id) {
    if (!this.videos[uid]) {
      this.videos[uid] = new YT.Player(uid, {
        ...{
          height: this.config.player.height,
          width: this.config.player.width,
          videoId: id,
          host: this.config.player.youtube.host,
          events: {
            onReady: () => this.onPlayerReady(uid),
            onStateChange: (event) => this.onYouTubeStateChange(uid, event)
          }
        },
        ...this.config.player.youtube
      });
    }
  }

  /**
   * Handle YouTube specific state changes
   * @param {string} uid - Player unique ID
   * @param {Object} event - YouTube player event
   */
  onYouTubeStateChange(uid, event) {
    const player = document.querySelector(`#${uid}`);

    if (event.data === 0 || event.data === 2) {
      this.timers[uid] = setTimeout(() => {
        player.dispatchEvent(this.config.events.stop);
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
  stopPlayer(uid) {
    document.querySelector(`#${uid}`).dispatchEvent(this.config.events.stop);
    this.videos[uid].stopVideo();
  }

  /**
   * Start the YouTube player
   * @param {string} uid - Player unique ID
   */
  startPlayer(uid) {
    document.querySelector(`#${uid}`).dispatchEvent(this.config.events.play);
    this.videos[uid].playVideo();
  }
}

const chickenYoutube = new ChickenYoutube();

export default chickenYoutube;

/* After YouTube API init */
window.onYouTubeIframeAPIReady = function () {
  chickenYoutube.apiReady = true;
  chickenYoutube.attemptPlayer(
    chickenYoutube.tempPlayerUid,
    chickenYoutube.tempPlayerId
  );
};
