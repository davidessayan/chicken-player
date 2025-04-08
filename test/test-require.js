// Configuration de RequireJS
require.config({
  baseUrl: '../dist/js',
  paths: {
    'chicken-player': 'main'
  }
});

// Chargement du module
require(['chicken-player'], function(ChickenPlayer) {
  // Attendre que le DOM soit chargé
  document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si ChickenPlayer est disponible
    if (!ChickenPlayer) {
      console.error('ChickenPlayer is not loaded');
      return;
    }

    // Initialiser avec la configuration par défaut
    ChickenPlayer.init();

    // Configuration personnalisée
    const customConfig = {
      uid: 'custom_player',
      width: 800,
      height: 450,
      autoplay: true,
      controls: true,
      mute: false
    };

    // Initialiser avec la configuration personnalisée
    ChickenPlayer.init(customConfig);

    // Écouter les événements
    document.addEventListener('chickenplayer:play', function(e) {
      console.log('Player started playing:', e.detail);
    });

    document.addEventListener('chickenplayer:stop', function(e) {
      console.log('Player stopped:', e.detail);
    });
  });
}); 