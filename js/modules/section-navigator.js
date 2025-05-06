/**
 * section-navigator.js - Module de navigation entre sections
 * Ce module gère la navigation par défilement, clavier et clics entre les sections
 */

const SectionNavigator = (function() {
  // Configuration
  const config = {
    scrollDelay: 500,     // Délai entre deux défilements (ms)
    wheelThreshold: 30    // Seuil de détection pour le défilement
  };

  // État
  let state = {
    currentIndex: 0,
    isScrolling: false,
    touchStartY: 0
  };

  // Éléments DOM
  let sections = [];

  // Utilitaires
  function addEvent(target, events, handler, options) {
    if (typeof events === 'string') events = [events];
    events.forEach(event => {
      target.addEventListener(event, handler, options);
    });
  }

  // Initialisation
  function init() {
    // Éléments DOM
    sections = document.querySelectorAll('.section');

    // Définir la section active initiale
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
      // Trouver l'index de la section active
      sections.forEach((section, index) => {
        if (section === activeSection) {
          state.currentIndex = index;
        }
      });
    }

    // Initialiser les gestionnaires d'événements
    initEventListeners();

    console.log("SectionNavigator: Initialisation terminée!");
  }

  // Configuration des événements
  function initEventListeners() {
    // Événements de navigation
    addEvent(window, 'wheel', handleWheel, { passive: false });
    addEvent(window, 'keydown', handleKeyboard);
    addEvent(window, ['touchstart', 'touchend'], handleTouch);

    // Empêcher les clics pendant le défilement
    document.addEventListener('click', (e) => {
      if (state.isScrolling) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });

    // Ajouter des écouteurs d'événements pour les lignes de navigation
    setupNavigationDots();
  }

  // Configuration des points de navigation
  function setupNavigationDots() {
    const lignes = document.querySelectorAll('.ligne');

    if (lignes.length === sections.length) {
      lignes.forEach((ligne, index) => {
        ligne.addEventListener('click', () => {
          navigateToIndex(index);
        });
      });
    }
  }

  // Navigation vers une section spécifique par ID
  function navigateTo(sectionId) {
    sections.forEach((section, index) => {
      if (section.id === sectionId) {
        navigateToIndex(index);
      }
    });
  }

  // Navigation vers une section par index
  function navigateToIndex(index) {
    if (index < 0 || index >= sections.length || state.isScrolling) return;

    state.isScrolling = true;
    state.currentIndex = index;
    updateActiveSection();

    setTimeout(() => {
      state.isScrolling = false;
    }, config.scrollDelay);
  }

  // Fonction commune pour défiler
  function scroll(direction) {
    if (state.isScrolling) return;

    const newIndex = state.currentIndex + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;

    navigateToIndex(newIndex);
  }

  // Défilement vers le haut
  function scrollUp() {
    scroll(-1);
  }

  // Défilement vers le bas
  function scrollDown() {
    scroll(1);
  }

  // Mise à jour de la section active
  function updateActiveSection() {
    const targetSection = sections[state.currentIndex];

    if (!targetSection) return;

    // Mettre à jour les indicateurs de navigation
    updateNavigationDots();

    // Utiliser le contrôleur de transition
    if (window.TransitionController) {
      TransitionController.transitionTo(targetSection);
    } else {
      // Fallback si TransitionController n'est pas disponible
      sections.forEach((section, index) => {
        if (index === state.currentIndex) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    }
  }

  // Mise à jour des indicateurs de navigation
  function updateNavigationDots() {
    const lignes = document.querySelectorAll('.ligne');

    if (lignes.length === sections.length) {
      lignes.forEach((ligne, index) => {
        if (index === state.currentIndex) {
          ligne.classList.add('active');
        } else {
          ligne.classList.remove('active');
        }
      });
    }
  }

  // Gestionnaires d'événements
  function handleWheel(e) {
    e.preventDefault();
    if (state.isScrolling) return;

    // Si on est sur la page d'accueil et que le scroll vient de commencer, démarrer l'animation
    if (state.currentIndex === 0 && window.HomeAnimator && !window.HomeAnimator.state.animationStarted) {
      window.HomeAnimator.startAnimation();
      return;
    }

    // Détection du défilement avec un seuil bas pour une meilleure réactivité
    if (Math.abs(e.deltaY) > config.wheelThreshold) {
      if (e.deltaY > 0) {
        scrollDown();
      } else {
        scrollUp();
      }
    }
  }

  function handleKeyboard(e) {
    if (state.isScrolling) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      scrollDown();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      scrollUp();
    }
  }

  function handleTouch(e) {
    if (e.type === 'touchstart') {
      state.touchStartY = e.changedTouches[0].screenY;
    } else if (e.type === 'touchend') {
      if (state.isScrolling) return;

      const touchEndY = e.changedTouches[0].screenY;
      const diff = state.touchStartY - touchEndY;

      // Si on est sur la page d'accueil et que c'est le premier swipe
      if (state.currentIndex === 0 && window.HomeAnimator && !window.HomeAnimator.state.animationStarted) {
        window.HomeAnimator.startAnimation();
        return;
      }

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          scrollDown();
        } else {
          scrollUp();
        }
      }
    }
  }

  // API publique
  return {
    init: init,
    navigateTo: navigateTo,
    navigateToIndex: navigateToIndex,
    scrollUp: scrollUp,
    scrollDown: scrollDown
  };
})();

// Exporter le module
window.SectionNavigator = SectionNavigator;
