/**
 * Chicken Player - Dailymotion Implementation
 * @author David Essayan
 * @version 1.0.0
 * @description Dailymotion video player implementation
 */

import ChickenPlayerBase from './chicken-player-base';

class ChickenDailymotion extends ChickenPlayerBase {
  /**
   * Initialize the Dailymotion API
   */
  initApi() {
    if (!this.config.player.dailymotion.playerId) {
      console.error('Dailymotion player ID is not set');
      return false;
    }

    const tag = document.createElement("script");
    tag.src = `https://geo.dailymotion.com/libs/player/${this.config.player.dailymotion.playerId}.js`;

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  /**
   * Create a new Dailymotion player instance
   * @param {string} uid - Player unique ID
   * @param {string} id - Video ID
   */
  createPlayer(uid, id) {
    if (!this.videos[uid]) {
      dailymotion
        .createPlayer(uid, {
          ...{
            video: id
          },
          ...this.config.player.dailymotion
        })
        .then((player) => {
          this.videos[uid] = player;
          this.onPlayerReady(uid);
          this.onPlayerStateChange(uid);
        });
    }
  }
}

const chickenDailymotion = new ChickenDailymotion();

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