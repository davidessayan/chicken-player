/**
 * Chicken Player - Vimeo Implementation
 * @author David Essayan
 * @version 1.0.0
 * @description Vimeo video player implementation
 */

import ChickenPlayerBase from './chicken-player-base';

class ChickenVimeo extends ChickenPlayerBase {
  /**
   * Initialize the Vimeo API
   */
  initApi() {
    const tag = document.createElement("script");
    tag.src = "//player.vimeo.com/api/player.js";
    tag.onload = onVimeoReadyCallback;

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  /**
   * Create a new Vimeo player instance
   * @param {string} uid - Player unique ID
   * @param {string} id - Video ID
   */
  createPlayer(uid, id) {
    if (!this.videos[uid]) {
      this.videos[uid] = new Vimeo.Player(uid, {
        ...{
          height: this.config.player.height,
          width: this.config.player.width,
          id: id
        },
        ...this.config.player.vimeo
      });

      this.onPlayerReady(uid);
      this.onPlayerStateChange(uid);
    }
  }
}

const chickenVimeo = new ChickenVimeo();

export default chickenVimeo;

/* After vimeo API init */
window.onVimeoReadyCallback = function () {
  chickenVimeo.apiReady = true;
  chickenVimeo.attemptPlayer(
    chickenVimeo.tempPlayerUid,
    chickenVimeo.tempPlayerId
  );
};
