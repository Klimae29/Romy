/**
 * transition-controller.js - Module de contrôle des transitions entre sections
 * Ce module gère les transitions fluides entre les différentes sections du site
 */

const TransitionController = (function() {
  // Configuration
  const config = {
    animationDuration: 800,   // Durée des animations en ms (doit correspondre à --anim-duration en CSS)
    fadeOutDuration: 600,     // Durée des animations de sortie (doit correspondre à --fade-out-duration en CSS)
    minTransitionDelay: 1000  // Délai minimum entre les transitions
  };

  // État
  let state = {
    isTransitioning: false,
    currentSection: null,
    previousSection: null
  };

  // Éléments DOM
  let sections = [];

  // Mise à jour de la couleur de fond selon la section
  function updateBackgroundColor(section) {
    if (!section) return;

    const bgColor = section.dataset.bgColor || '#000';
    document.body.style.backgroundColor = bgColor;
  }

  // Configuration de l'observateur pour les transitions
  function setupTransitionObserver() {
    sections.forEach(section => {
      section.addEventListener('transitionend', (e) => {
        // Ne réagir qu'aux transitions d'opacité de la section elle-même
        if (e.target === section && e.propertyName === 'opacity') {
          // Si la section devient visible (fin de transition d'entrée)
          if (section.classList.contains('active') && getComputedStyle(section).opacity > 0) {
            state.isTransitioning = false;
            onTransitionComplete(section);
          }
        }
      });
    });
  }

  // Transition vers une nouvelle section
  function transitionTo(targetSection) {
    if (state.isTransitioning || !targetSection) return false;

    // Marquer comme en transition
    state.isTransitioning = true;

    // Stocker la référence à la section précédente
    state.previousSection = state.currentSection;
    state.currentSection = targetSection;

    // Appliquer les classes pour déclencher les transitions CSS
    if (state.previousSection) {
      state.previousSection.classList.remove('active');
      state.previousSection.classList.add('leaving');
    }

    targetSection.classList.add('active');

    // Mettre à jour la couleur de fond
    updateBackgroundColor(targetSection);

    // S'assurer que la transition est terminée même si l'événement transitionend n'est pas déclenché
    setTimeout(() => {
      // Nettoyer la section précédente
      if (state.previousSection) {
        state.previousSection.classList.remove('leaving');
      }

      // Marquer comme transition terminée si ça n'a pas déjà été fait
      if (state.isTransitioning) {
        state.isTransitioning = false;
        onTransitionComplete(targetSection);
      }
    }, config.animationDuration + 100);

    return true;
  }

  // Actions à exécuter une fois la transition terminée
  function onTransitionComplete(section) {
    // Déclencher l'événement personnalisé pour informer les autres modules
    const event = new CustomEvent('sectionTransitionComplete', {
      detail: {
        section: section,
        previousSection: state.previousSection
      }
    });
    document.dispatchEvent(event);

    console.log('Transition complétée pour la section:', section.id);
  }

  // Initialisation
  function init() {
    // Références DOM
    sections = document.querySelectorAll('.section');

    // Observer la fin des transitions
    setupTransitionObserver();

    // État initial
    state.currentSection = document.querySelector('.section.active');
    if (state.currentSection) {
      updateBackgroundColor(state.currentSection);
    }

    console.log("TransitionController: Initialisation terminée!");
    return true;
  }

  // API publique
  return {
    init: init,
    transitionTo: transitionTo,
    get state() { return { ...state }; }  // Exposer une copie de l'état
  };
})();

// Exporter le module
window.TransitionController = TransitionController;
