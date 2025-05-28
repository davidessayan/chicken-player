/**
 * Chicken Player Base Class
 * @author David Essayan
 * @version 1.0.0
 * @description Base class for video player implementations
 */

class ChickenPlayerBase {
    constructor() {
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
    initPlayer(id, uid, config) {
        if (!this.apiReady) {
            this.tempPlayerUid = uid;
            this.tempPlayerId = id;
            this.config = {
                needConsent: false,
                ...config
            };
            this.initApi();
        } else {
            this.attemptPlayer(uid, id);
        }
    }

    /**
     * Initialize the video API
     * @abstract
     */
    initApi() {
        throw new Error('initApi must be implemented by child class');
    }

    /**
     * Create a new player instance
     * @param {string} uid - Player unique ID
     * @param {string} id - Video ID
     * @abstract
     */
    createPlayer(uid, id) {
        throw new Error('createPlayer must be implemented by child class');
    }

    /**
     * Attempt to create or start the player
     * @param {string} uid - Player unique ID
     * @param {string} id - Video ID
     */
    attemptPlayer(uid, id) {
        if (this.videos[uid]) {
            setTimeout(() => {
                this.startPlayer(uid);
            }, 1500);
        } else {
            this.createPlayer(uid, id);
        }
    }

    /**
     * Stop the player
     * @param {string} uid - Player unique ID
     */
    stopPlayer(uid) {
        document.querySelector(`#${uid}`).dispatchEvent(this.config.events.stop);
        this.videos[uid].pause();
    }

    /**
     * Start the player
     * @param {string} uid - Player unique ID
     */
    startPlayer(uid) {
        document.querySelector(`#${uid}`).dispatchEvent(this.config.events.play);
        this.videos[uid].play();
    }

    /**
     * Handle player ready state
     * @param {string} uid - Player unique ID
     */
    onPlayerReady(uid) {
        const player = document.querySelector(`#${uid}`);
        const wrapperSelector = `.${this.config.classes.wrapper}`;
        const wrapper = player.closest(wrapperSelector);

        player.addEventListener('chickenPlayer.play', () => {
            wrapper.classList.remove(this.config.classes.stateLoading);
            wrapper.classList.add(this.config.classes.statePlaying);
        });

        player.addEventListener('chickenPlayer.stop', () => {
            wrapper.classList.remove(this.config.classes.statePlaying);
        });

        this.startPlayer(uid);
    }

    /**
     * Handle player state changes
     * @param {string} uid - Player unique ID
     */
    onPlayerStateChange(uid) {
        const player = document.querySelector(`#${uid}`);

        this.videos[uid].on('pause', () => {
            this.timers[uid] = setTimeout(() => {
                player.dispatchEvent(this.config.events.stop);
            }, 1000);
        });

        this.videos[uid].on('play', () => {
            clearTimeout(this.timers[uid]);
            player.dispatchEvent(this.config.events.play);
        });
    }
}

export default ChickenPlayerBase; 