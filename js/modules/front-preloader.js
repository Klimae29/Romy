/**
 * font-preloader.js - Préchargement des polices pour l'animation ROMY
 * Version autonome (remplace le préchargeur HTML supprimé)
 */

const FontPreloader = {
  name: "FontPreloader",

  fonts: [
    "'Playfair Display', serif",
    "'Amatic SC', cursive",
    "'Anton', sans-serif",
    "'Orbitron', sans-serif",
    "'Lucida Console', monospace",
    "'Pacifico', cursive",
    "'Trebuchet MS', sans-serif",
    "'Impact', sans-serif",
    "'Poppins', sans-serif",
  ],

  preloaderElement: null,

  init() {
    console.log("FontPreloader: Initialisation...");

    // Créer le préchargeur
    this.preloaderElement = document.createElement('div');
    this.preloaderElement.className = 'font-preloader';

    // Styles pour masquer le préchargeur
    Object.assign(this.preloaderElement.style, {
      position: 'absolute',
      left: '-9999px',
      visibility: 'hidden',
      opacity: '0',
      pointerEvents: 'none'
    });

    // Créer un span pour chaque police
    this.fonts.forEach(font => {
      const span = document.createElement('span');
      span.style.fontFamily = font;
      span.textContent = 'ROMY';
      this.preloaderElement.appendChild(span);
    });

    // Ajouter au DOM
    document.body.appendChild(this.preloaderElement);

    console.log("✅ Préchargeur de polices créé");

    // Retourner true pour la compatibilité avec votre fonction initModule
    return true;
  },

  // Méthode utilitaire pour vérifier si les polices sont chargées
  areAllFontsLoaded() {
    return document.fonts.check("12px 'Playfair Display'") &&
           document.fonts.check("12px 'Amatic SC'") &&
           document.fonts.check("12px 'Anton'") &&
           document.fonts.check("12px 'Orbitron'") &&
           document.fonts.check("12px 'Pacifico'") &&
           document.fonts.check("12px 'Poppins'");
  },

  // Nettoyage (optionnel - à appeler si vous voulez supprimer le préchargeur après initialisation)
  cleanup() {
    if (this.preloaderElement && this.preloaderElement.parentNode) {
      this.preloaderElement.parentNode.removeChild(this.preloaderElement);
      this.preloaderElement = null;
      console.log("FontPreloader: Préchargeur supprimé");
    }
  }
};

// Exporter le module
window.FontPreloader = FontPreloader;
