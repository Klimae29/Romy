/**
 * animation-controller.js - Module de contrôle des animations
 * Ce module gère les animations des éléments dans chaque section
 */

const AnimationController = (function() {
  // Configuration
  const config = {
    duration: 800,           // Durée des animations en ms (doit correspondre à --anim-duration en CSS)
    baseDelay: 150,          // Délai de base entre les animations en ms (doit correspondre à --anim-base-delay en CSS)
    resetDelay: 50,          // Délai pour réinitialiser les animations (ms)
    animationDelay: 100,     // Délai avant de démarrer les animations (ms)
    exitDelay: 600           // Durée des animations de sortie (ms) (doit correspondre à --fade-out-duration en CSS)
  };

  // État
  let state = {
    initialized: false,
    processingTransition: false,
    currentSection: null,
    previousSection: null
  };

  // Forcer le reflow d'un élément pour réinitialiser ses animations
  function forceReflow(element) {
    if (!element) return;
    void element.offsetWidth; // Accéder à une propriété qui force un reflow
  }

  // Préparation des descriptions pour animation ligne par ligne
  function prepareDescriptions() {
    const descriptions = document.querySelectorAll('.project-description');
    console.log(`Préparation de ${descriptions.length} descriptions`);

    descriptions.forEach((description, idx) => {
      // Ne pas retraiter si déjà fait
      if (description.querySelector('.project-description-line')) {
        return;
      }

      // Récupérer le texte original
      const originalText = description.textContent.trim();
      console.log(`Préparation description #${idx}: "${originalText.substring(0, 30)}..."`);

      // Diviser en phrases (séparées par des points ou des retours à la ligne)
      const lines = originalText.split(/(?<=\.)(?:\s+|\n)|(?<=\n)/g)
        .map(line => line.trim())
        .filter(line => line.length > 0);

      // Vider le contenu original
      description.innerHTML = '';

      // Créer un span pour chaque ligne
      lines.forEach((line, lineIdx) => {
        const lineElement = document.createElement('span');
        lineElement.className = 'project-description-line';
        lineElement.textContent = line + ' '; // Ajouter un espace après chaque ligne
        description.appendChild(lineElement);
      });

      // Envelopper dans un conteneur si ce n'est pas déjà fait
      const parent = description.parentElement;
      if (!parent.classList.contains('project-description-container')) {
        const container = document.createElement('div');
        container.className = 'project-description-container';
        parent.insertBefore(container, description);
        container.appendChild(description);
      }
    });
  }

  // Réinitialise les animations d'une section
  function resetSectionAnimations(section) {
    if (!section) return;

    console.log('Réinitialisation des animations pour:', section.id);

    // Ajouter une classe pour désactiver les transitions pendant la réinitialisation
    section.classList.add('resetting-animations');

    // Sélectionner tous les éléments animés
    const elements = section.querySelectorAll(
      '.project-title-container, .project-video-container, ' +
      '.project-description-container, .project-description, .project-description-line'
    );

    // Réinitialiser l'état visuel selon le type d'élément
    elements.forEach(el => {
      if (el.classList.contains('project-title-container')) {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-60px)';
      } else if (el.classList.contains('project-video-container')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-60px)';
      } else if (el.classList.contains('project-description-container') ||
                el.classList.contains('project-description')) {
        el.style.opacity = '0';
      } else if (el.classList.contains('project-description-line')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
      }
    });

    // Forcer un reflow pour que les changements prennent effet
    forceReflow(section);

    // Retirer la classe de réinitialisation après un court délai
    setTimeout(() => {
      section.classList.remove('resetting-animations');
    }, config.resetDelay);
  }

  // Déclenche les animations pour une section active
  function playSectionAnimations(section) {
    if (!section || !section.classList.contains('active')) return;

    console.log('Démarrage des animations pour:', section.id);
    state.currentSection = section;

    // S'assurer que la section est prête pour les animations
    section.classList.add('animations-ready');

    // Petit délai pour s'assurer que la réinitialisation est terminée
    setTimeout(() => {
      // Ajouter la classe qui déclenche les animations
      section.classList.add('playing-animations');
    }, config.animationDelay);
  }

  // Prépare la sortie d'une section (animations de disparition)
  function prepareExitAnimations(section) {
    if (!section) return;

    console.log('Préparation des animations de sortie pour:', section.id);

    // Ajouter une classe spécifique pour les animations de sortie
    section.classList.add('leaving');

    // Prévoir de retirer la classe après la fin de l'animation
    setTimeout(() => {
      section.classList.remove('leaving');
    }, config.exitDelay);
  }

  // Gestionnaire d'événements de transition entre sections
  function handleSectionTransition(event) {
    // Éviter les traitements multiples
    if (state.processingTransition) return;
    state.processingTransition = true;

    const currentSection = event.detail.section;
    const prevSection = event.detail.previousSection;

    console.log('Transition entre sections:',
                prevSection ? prevSection.id : 'none',
                '→',
                currentSection ? currentSection.id : 'none');

    // Préparer les animations de sortie pour la section précédente
    if (prevSection) {
      prepareExitAnimations(prevSection);
    }

    // Réinitialiser les animations pour la nouvelle section active
    resetSectionAnimations(currentSection);

    // Déclencher les animations après un court délai
    setTimeout(() => {
      playSectionAnimations(currentSection);
      state.processingTransition = false;
    }, config.resetDelay + 50);
  }

  // Initialisation
  function init() {
    // Éviter l'initialisation multiple
    if (state.initialized) return;

    // Vérifier si les dépendances sont chargées
    if (!window.TransitionController) {
      console.warn("AnimationController: Attente du chargement de TransitionController");
      setTimeout(init, 200);
      return;
    }

    console.log("AnimationController: Initialisation...");

    // Préparer les descriptions pour l'animation ligne par ligne
    prepareDescriptions();

    // Ajouter les classes nécessaires
    document.body.classList.add('animations-ready');

    // Écouter les événements de transition
    document.addEventListener('sectionTransitionComplete', handleSectionTransition);

    // Initialiser les animations pour la section active au chargement
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
      console.log("Section active au chargement:", activeSection.id);
      // Initialiser les animations après un court délai
      setTimeout(() => {
        playSectionAnimations(activeSection);
      }, 500);
    }

    // Observer les changements dans le DOM (pour les contenus dynamiques)
    const observer = new MutationObserver((mutations) => {
      let needsRefresh = false;

      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Vérifier si des éléments pertinents ont été ajoutés
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (
                node.classList.contains('project-description') ||
                node.querySelector('.project-description')
              )) {
              needsRefresh = true;
            }
          });
        }
      });

      if (needsRefresh) {
        console.log("Changements DOM détectés, rafraîchissement des descriptions");
        prepareDescriptions();

        // Si une section est active, réappliquer les animations
        if (state.currentSection) {
          playSectionAnimations(state.currentSection);
        }
      }
    });

    // Observer les changements dans le document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    state.initialized = true;
    console.log("AnimationController: Initialisation terminée!");
  }

  // API publique
  return {
    init: init,
    resetSectionAnimations: resetSectionAnimations,
    playSectionAnimations: playSectionAnimations,
    prepareExitAnimations: prepareExitAnimations
  };
})();

// Exporter le module
window.AnimationController = AnimationController;
