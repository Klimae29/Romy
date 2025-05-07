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
    // Ne rien faire car nous utilisons maintenant le fond en dégradé conique global
    // Cette fonction est conservée pour la compatibilité avec le code existant
    return;
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

  // Dans la fonction transitionTo de transition-controller.js
  // Dans la fonction transitionTo de transition-controller.js
  function transitionTo(targetSection) {
    if (state.isTransitioning || !targetSection) return false;

    // Marquer comme en transition
    state.isTransitioning = true;

    // Stocker la référence à la section précédente
    state.previousSection = state.currentSection;
    state.currentSection = targetSection;

    // Si la section précédente est 'home', nettoyer juste les éléments d'animation
    if (state.previousSection && state.previousSection.id === 'home') {
      console.log("TransitionController: Quittant la section d'accueil");

      // Arrêter l'animation sans détruire le module
      if (window.HomeAnimator && window.HomeAnimator.stopAnimation) {
        window.HomeAnimator.stopAnimation();
      }

      // Masquer uniquement les éléments spécifiques d'animation
      const bg1 = document.getElementById('bg1');
      const bg2 = document.getElementById('bg2');
      const romy = document.getElementById('romy');

      if (bg1) {
        bg1.style.opacity = "0";
        bg1.style.visibility = "hidden";
      }

      if (bg2) {
        bg2.style.opacity = "0";
        bg2.style.visibility = "hidden";
      }

      if (romy) {
        romy.style.opacity = "0";
        romy.style.visibility = "hidden";
      }
    }

    // SOLUTION RADICALE : Isoler complètement les deux phases
    if (state.previousSection) {
      // 1. Retirer active et ajouter leaving à la section précédente
      state.previousSection.classList.remove('active');
      state.previousSection.classList.add('leaving');

      // Forcer un reflow pour s'assurer que les styles sont appliqués immédiatement
      void state.previousSection.offsetWidth;

      // 2. BLOQUER temporairement toute autre mise à jour pendant l'animation de sortie
      document.body.classList.add('transition-in-progress');

      console.log("Animation de sortie démarrée");

      // Attendre exactement la durée de l'animation de sortie
      setTimeout(() => {
        console.log("Animation de sortie terminée");

        // 3. Seulement APRÈS l'animation de sortie, activer la nouvelle section
        document.body.classList.remove('transition-in-progress');
        targetSection.classList.add('active');
      }, 600); // Durée fixe correspondant à --fade-out-duration (0.6s)
    } else {
      // Pas de section précédente, activer directement
      targetSection.classList.add('active');
    }

    // S'assurer que la transition est terminée même si l'événement transitionend n'est pas déclenché
    setTimeout(() => {
      // Nettoyer la section précédente
      if (state.previousSection) {
        state.previousSection.classList.remove('leaving');
      }

      // Marquer comme transition terminée
      state.isTransitioning = false;
      onTransitionComplete(targetSection);
    }, 1500); // Délai plus long pour couvrir toutes les animations

    return true;
  }

  // Actions à exécuter une fois la transition terminée
  function onTransitionComplete(section) {
    // Actions existantes...

    // Si la section active n'est pas 'home', s'assurer que l'animation est bien arrêtée
    if (section.id !== 'home' && window.HomeAnimator) {
        window.HomeAnimator.stopAnimation();

        // Forcer une vérification supplémentaire pour masquer les éléments d'animation
        const homeElements = document.querySelectorAll('#romy, #bg1, #bg2');
        homeElements.forEach(el => {
            if (el) {
                el.style.opacity = "0";
                el.style.visibility = "hidden";
                el.style.zIndex = "-10";
            }
        });
    }

    // Événement personnalisé et log existants...
  }

  // Initialisation
  function init() {
    // Références DOM
    sections = document.querySelectorAll('.section');

    // Observer la fin des transitions
    setupTransitionObserver();

    // État initial
    state.currentSection = document.querySelector('.section.active');

    // Ne pas mettre à jour la couleur de fond car nous utilisons un fond global
    // if (state.currentSection) {
    //   updateBackgroundColor(state.currentSection);
    // }

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
