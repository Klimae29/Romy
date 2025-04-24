/**
 * font-preloader.js - Préchargement des polices pour l'animation ROMY
 */

// Script à ajouter avant l'initialisation de HomeAnimator

const FontPreloader = {
  fonts: [
    "'Comic Sans MS', cursive",
    "'Amatic SC', cursive",
    "'Anton', sans-serif",
    "'Orbitron', sans-serif",
    "'Lucida Console', monospace",
    "'Pacifico', cursive",
    "'Trebuchet MS', sans-serif",
    "'Impact', sans-serif",
    "'Brush Script MT', cursive"
  ],

  // Préchargement actif des polices
  preload() {
    console.log("Préchargement des polices...");

    // Créer un div caché pour précharger
    const preloader = document.createElement('div');
    preloader.className = 'font-preloader';
    preloader.style.position = 'absolute';
    preloader.style.left = '-9999px';
    preloader.style.visibility = 'hidden';
    preloader.style.opacity = '0';

    // Créer un span pour chaque police
    this.fonts.forEach(font => {
      const span = document.createElement('span');
      span.style.fontFamily = font;
      span.textContent = 'ROMY';
      preloader.appendChild(span);
    });

    // Ajouter au DOM
    document.body.appendChild(preloader);

    console.log("✅ Préchargement des polices terminé");

    // Retourner une promesse qui se résout quand les polices sont chargées
    return new Promise(resolve => {
      // Attendre que les polices soient chargées
      document.fonts.ready.then(() => {
        console.log("✅ Toutes les polices sont chargées!");
        resolve();
      });
    });
  }
};

// Initialiser le préchargement des polices avant de démarrer l'animation
document.addEventListener('DOMContentLoaded', async function() {
  // Précharger les polices d'abord
  await FontPreloader.preload();

  // Puis initialiser les animations comme d'habitude
  // L'initialisation du HomeAnimator se fera après que les polices soient chargées
});
