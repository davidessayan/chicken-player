/**
 * Chicken Player - HTML5 Implementation
 * @author David Essayan
 * @version 1.0.0
 * @description HTML5 video player implementation
 */

import ChickenPlayerBase from './chicken-player-base';

class ChickenHtml5 extends ChickenPlayerBase {
    /**
     * Initialize the HTML5 player
     * No API initialization needed for HTML5
     */
    initApi() {
        this.apiReady = true;
        this.attemptPlayer(
            this.tempPlayerUid,
            this.tempPlayerId
        );
    }

    /**
     * Create a new HTML5 player instance
     * @param {string} uid - Player unique ID
     * @param {string} id - Video URL
     */
    createPlayer(uid, id) {
        console.log('createPlayer', uid, id);
        if (!this.videos[uid]) {
            const video = document.createElement('video');
            video.id = uid;
            video.className = 'html5-player';

            // Apply HTML5 configuration
            const html5Config = this.config.player.html5;
            video.controls = html5Config.controls;
            video.preload = html5Config.preload;
            video.autoplay = html5Config.autoplay;
            video.loop = html5Config.loop;
            video.muted = html5Config.muted;
            video.width = html5Config.width;
            video.height = html5Config.height;

            // Set attributes
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            if (html5Config.poster) {
                video.setAttribute('poster', html5Config.poster);
            }
            if (html5Config.crossorigin) {
                video.setAttribute('crossorigin', html5Config.crossorigin);
            }
            if (html5Config.disablePictureInPicture) {
                video.setAttribute('disablePictureInPicture', '');
            }
            if (html5Config.disableRemotePlayback) {
                video.setAttribute('disableRemotePlayback', '');
            }
            if (html5Config.controlsList) {
                video.setAttribute('controlsList', html5Config.controlsList);
            }

            // Add source element
            const source = document.createElement('source');
            source.src = id;
            source.type = this.getVideoType(id);
            video.appendChild(source);

            // Replace iframe with video element
            const iframe = document.querySelector(`#${uid}`);
            if (iframe) {
                iframe.parentNode.replaceChild(video, iframe);
            }

            this.videos[uid] = video;
            this.onPlayerReady(uid);
            this.onPlayerStateChange(uid);
        }
    }

    /**
     * Get video MIME type from URL
     * @param {string} url - Video URL
     * @returns {string} Video MIME type
     */
    getVideoType(url) {
        const extension = url.split('.').pop().toLowerCase();
        console.log('extension', extension);
        const types = {
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'ogg': 'video/ogg',
            'mov': 'video/quicktime',
            'm4v': 'video/x-m4v'
        };
        return types[extension] || 'video/mp4';
    }

    /**
     * Stop the HTML5 player
     * @param {string} uid - Player unique ID
     */
    stopPlayer(uid) {
        const player = document.querySelector(`#${uid}`);
        player.dispatchEvent(this.config.events.stop);
        this.videos[uid].pause();
    }

    /**
     * Start the HTML5 player
     * @param {string} uid - Player unique ID
     */
    startPlayer(uid) {
        const player = document.querySelector(`#${uid}`);
        player.dispatchEvent(this.config.events.play);
        this.videos[uid].play();
    }

    /**
     * Handle player state changes
     * @param {string} uid - Player unique ID
     */
    onPlayerStateChange(uid) {
        const player = document.querySelector(`#${uid}`);

        this.videos[uid].addEventListener('pause', () => {
            this.timers[uid] = setTimeout(() => {
                player.dispatchEvent(this.config.events.stop);
            }, 1000);
        });

        this.videos[uid].addEventListener('play', () => {
            clearTimeout(this.timers[uid]);
            player.dispatchEvent(this.config.events.play);
        });
    }
}

const chickenHtml5 = new ChickenHtml5();

export default chickenHtml5; 