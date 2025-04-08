/**
 * Chicken Player - CommonJS Test
 * @description Test file to verify the package works correctly with CommonJS
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Chicken Player with CommonJS...');
  
  if (!ChickenPlayer) {
    console.error('ChickenPlayer is not available. Make sure the script is loaded correctly.');
    return;
  }
  
  // Initialize ChickenPlayer with default configuration
  const player = new ChickenPlayer();
  
  // Test with custom configuration
  const customPlayer = new ChickenPlayer({
    player: {
      width: 800,
      height: 450,
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
      src: 'https://placehold.co/800x450',
      width: 800,
      height: 450
    }
  });
  
  console.log('Chicken Player initialized successfully with CommonJS');
  
  // Add event listeners for play and stop events
  document.querySelectorAll('.cbo-chickenplayer').forEach(el => {
    el.addEventListener('chickenPlayer.play', () => {
      console.log('Player started playing');
    });
    
    el.addEventListener('chickenPlayer.stop', () => {
      console.log('Player stopped');
    });
  });
}); 