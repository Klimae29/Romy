/**
 * animation-controller.js - Module de contrôle des animations
 * Adaptation de la version originale pour la nouvelle architecture
 */

// Définir le module comme un objet global pour la compatibilité
const AnimationController = {
  // Préparation des descriptions par lignes
  prepareDescriptions() {
    const descriptions = document.querySelectorAll('.project-description');
    console.log(`Préparation de ${descriptions.length} descriptions`);

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

    if (!sectionNav) {
      console.warn("AnimationController: SectionNavigator non disponible");
      return;
    }

    console.log("AnimationController: Amélioration des transitions de section");

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
    console.log("AnimationController: Initialisation...");

    // Vérifier que SectionNavigator est disponible
    if (!window.SectionNavigator) {
      console.warn("AnimationController: SectionNavigator non disponible, nouvelle tentative dans 200ms");
      setTimeout(() => this.init(), 200);
      return;
    }

    // Préparer les descriptions pour l'animation ligne par ligne
    this.prepareDescriptions();

    // Améliorer les transitions entre sections
    this.enhanceTransitions();

    // Ajouter une classe pour signaler que les animations sont prêtes
    document.body.classList.add('animations-ready');

    // Configurer l'émission d'événements pour les changements de section
    this.setupSectionChangeEvents();

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

    console.log("AnimationController: Initialisation terminée!");
    return true;
  },

  // Configurer l'émission d'événements pour les changements de section
  setupSectionChangeEvents() {
    const sectionNav = window.SectionNavigator;
    if (!sectionNav) return;

    console.log("AnimationController: Configuration des événements de section");

    // Sauvegarder la méthode d'origine
    const originalScrollMethod = sectionNav.scroll;

    // Remplacer par notre version qui émet un événement
    sectionNav.scroll = function(direction) {
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
};

// Exposer le module globalement
window.AnimationController = AnimationController;
