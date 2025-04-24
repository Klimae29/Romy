/**
 * animations.js - Gestion avancée des animations pour le site ROMY
 */

// Module d'animations pour le site
const AnimationController = {
  // Préparation des descriptions par lignes
  prepareDescriptions() {
    const descriptions = document.querySelectorAll('.project-description');

    descriptions.forEach(description => {
      // Récupérer le texte original
      const originalText = description.textContent.trim();

      // Diviser en phrases (séparées par des points ou des retours à la ligne)
      const lines = originalText.split(/(?<=\.)(?:\s+|\n)|(?<=\n)/g)
        .map(line => line.trim())
        .filter(line => line.length > 0);

      // Vider le contenu original
      description.innerHTML = '';

      // Créer un span pour chaque ligne
      lines.forEach(line => {
        const lineElement = document.createElement('span');
        lineElement.className = 'project-description-line';
        lineElement.textContent = line + ' '; // Ajouter un espace après chaque ligne
        description.appendChild(lineElement);
      });
    });
  },

  // Optimisation des transitions de section
  enhanceTransitions() {
    // Référence au contrôleur de section existant
    const sectionNav = window.SectionNavigator;

    if (!sectionNav) return;

    // Sauvegarder la méthode d'origine
    const originalUpdateActive = sectionNav.updateActiveSection;

    // Remplacer par notre version améliorée
    sectionNav.updateActiveSection = function() {
      // Avant de changer de section, marquer celle qui va disparaître
      const currentActive = document.querySelector('.section.active');
      if (currentActive) {
        currentActive.classList.add('leaving');
      }

      // Appeler la méthode originale
      originalUpdateActive.call(this);

      // Après un court délai, nettoyer les classes
      setTimeout(() => {
        document.querySelectorAll('.section.leaving').forEach(section => {
          section.classList.remove('leaving');
        });
      }, 1000); // Délai supérieur à la durée de transition
    };
  },

  // Initialisation
  init() {
    // Préparer les descriptions pour l'animation ligne par ligne
    this.prepareDescriptions();

    // Améliorer les transitions entre sections
    this.enhanceTransitions();

    // Ajouter une classe pour signaler que les animations sont prêtes
    document.body.classList.add('animations-ready');

    // Écouter les changements de section pour réinitialiser les animations
    document.addEventListener('sectionChanged', (e) => {
      // Si l'événement contient une référence à la section précédente
      if (e.detail && e.detail.previousSection) {
        // Réinitialiser les animations de cette section
        const prevSection = e.detail.previousSection;

        // Technique pour forcer une réinitialisation des animations
        const elements = prevSection.querySelectorAll('.project-title-container, .project-video-container, .project-description-line');
        elements.forEach(el => {
          // Forcer un reflow
          el.style.display = 'none';
          void el.offsetWidth; // Truc pour forcer un reflow
          el.style.display = '';
        });
      }
    });
  }
};

// Initialiser quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
  // Attendre un court instant pour s'assurer que le reste du site est initialisé
  setTimeout(() => {
    AnimationController.init();
  }, 100);
});

// Émettre un événement lors du changement de section
// Extension du SectionNavigator existant
(function() {
  // Attendre que le SectionNavigator soit initialisé
  const checkInterval = setInterval(() => {
    if (window.SectionNavigator) {
      clearInterval(checkInterval);

      // Sauvegarder la méthode d'origine
      const originalScrollMethod = window.SectionNavigator.scroll;

      // Remplacer par notre version qui émet un événement
      window.SectionNavigator.scroll = function(direction) {
        // Obtenir la section active avant le changement
        const prevSection = document.querySelector('.section.active');

        // Appeler la méthode originale
        originalScrollMethod.call(this, direction);

        // Émettre un événement personnalisé
        const event = new CustomEvent('sectionChanged', {
          detail: {
            direction: direction,
            previousSection: prevSection,
            currentSection: document.querySelector('.section.active')
          }
        });
        document.dispatchEvent(event);
      };
    }
  }, 100);
})();
