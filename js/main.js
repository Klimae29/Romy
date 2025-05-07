// main.js - Script principal d'initialisation du site ROMY

document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ DOM chargé !");

  // Initialiser le préchargeur de polices en premier si disponible
  if (window.FontPreloader) {
    FontPreloader.init();
    console.log("✅ Préchargeur de polices initialisé");
  }

  // Démarrer le menu
  initMenu();

  // Attendre que les polices soient chargées avant de démarrer les modules
  document.fonts.ready.then(() => {
    console.log("✅ Toutes les polices Google Fonts sont chargées !");
    // Démarrer tous les modules dans l'ordre
    initSequence();
  });
});

// Fonction qui démarre tous les modules dans l'ordre
async function initSequence() {
  try {
    // Initialiser d'abord l'effet cinématographique de fond
    if (window.CinemaBackgroundEffect) {
      await initModule(window.CinemaBackgroundEffect);
    }

    // Démarrer les modules principaux dans l'ordre
    if (window.TransitionController) {
      await initModule(window.TransitionController);
    }

    if (window.AnimationController) {
      await initModule(window.AnimationController);
    }

    if (window.SectionNavigator) {
      await initModule(window.SectionNavigator);
    }

    if (window.VideoPlayer) {
      await initModule(window.VideoPlayer);
    }

    // Vérifier que l'élément #romy existe avant d'initialiser HomeAnimator
    if (document.querySelector('#romy') && window.HomeAnimator) {
      await initModule(window.HomeAnimator);
    }

    // Marquer le site comme chargé
    document.body.classList.add('loaded');

    // Ajouter la classe home-active si la section d'accueil est active au chargement
    if (document.querySelector('#home.active')) {
      document.body.classList.add('home-active');
    }

    console.log("✅ Initialisation complète du site !");
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  }
}

// Fonction qui démarre un module et gère les erreurs
function initModule(module) {
  return new Promise((resolve) => {
    try {
      if (!module) {
        console.warn("Module non disponible");
        resolve();
        return;
      }

      console.log(`Initialisation du module: ${module.name || 'Sans nom'}`);
      const result = module.init();

      if (result instanceof Promise) {
        result.then(() => {
          console.log(`Module ${module.name || 'Sans nom'} initialisé avec succès`);
          resolve();
        }).catch((error) => {
          console.error(`Erreur lors de l'initialisation du module ${module.name || 'Sans nom'}:`, error);
          resolve(); // Continue quand même
        });
      } else {
        console.log(`Module ${module.name || 'Sans nom'} initialisé avec succès`);
        resolve();
      }
    } catch (error) {
      console.error(`Erreur lors de l'initialisation d'un module:`, error);
      resolve(); // Continue quand même
    }
  });
}

// Configuration du menu
function initMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const menuPanel = document.getElementById('menuPanel');
  const menuLinks = document.querySelectorAll('.menu-items a');

  if (!menuToggle || !menuPanel) {
    console.warn("Éléments du menu manquants");
    return;
  }

  console.log("Configuration du menu...");

  // Bouton pour ouvrir le menu
  menuToggle.addEventListener('click', () => {
    menuPanel.classList.add('active');
  });

  // Bouton pour fermer le menu
  if (menuClose) {
    menuClose.addEventListener('click', () => {
      menuPanel.classList.remove('active');
    });
  }

  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      menuPanel.classList.remove('active');

      // La différence est ici - au lieu d'appeler directement resetAnimation/stopAnimation,
      // laissons l'événement sectionTransitionComplete s'en charger
      // comme pour la navigation au scroll

      // Naviguer vers la section via SectionNavigator qui déclenchera l'événement
      if (window.SectionNavigator) {
        window.SectionNavigator.navigateTo(targetId);
      } else {
        // Code fallback seulement si SectionNavigator n'est pas disponible
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
          });
          targetSection.classList.add('active');

          // Émettre manuellement l'événement sectionTransitionComplete
          const event = new CustomEvent('sectionTransitionComplete', {
            detail: { section: targetSection }
          });
          document.dispatchEvent(event);
        }
      }
    });
  });

  console.log("✅ Menu configuré avec succès");
}

// Observer les changements de section active et gérer les animations
// Cette fonction unique remplace tous les écouteurs d'événements précédents
// Ajouter à la fin de l'écouteur sectionTransitionComplete dans main.js
document.addEventListener('sectionTransitionComplete', function(event) {
  if (event.detail && event.detail.section) {
    const section = event.detail.section;

    if (section.id === 'home') {
      // Réinitialiser l'animation quand on retourne à l'accueil
      document.body.classList.add('home-active');

      // Forcer la visibilité même en cas d'échec de HomeAnimator
      const romyElement = document.getElementById('romy');
      const bg1Element = document.getElementById('bg1');

      if (romyElement) {
        romyElement.style.opacity = "1";
        romyElement.style.visibility = "visible";
        romyElement.style.zIndex = "1";
      }

      if (bg1Element) {
        // Si l'image n'est pas déjà définie, définir l'image par défaut
        if (!bg1Element.style.backgroundImage || bg1Element.style.backgroundImage === 'none') {
          const defaultImagePath = '../../assets/images/index_univ_1.png';
          bg1Element.style.backgroundImage = `url(${defaultImagePath})`;
          console.log("Image forcée: " + defaultImagePath);
        }
        bg1Element.style.opacity = "1";
        bg1Element.style.visibility = "visible";
        bg1Element.style.zIndex = "-1";
      }

      if (window.HomeAnimator) {
        window.HomeAnimator.resetAnimation();
        console.log("🏠 Retour à l'accueil : animation réinitialisée");

        // Vérifier après un court délai que tout s'est bien passé
        setTimeout(() => {
          window.debugROMY.verifyHomeState();
        }, 300);
      }
    } else {
      // Code existant pour arrêter l'animation...
    }
  }
});

// Gestionnaire supplémentaire pour la navigation par molette/touches
window.addEventListener('wheel', function(e) {
  // Si on est sur la page d'accueil et qu'on défile vers le bas
  if (document.querySelector('#home.active') && e.deltaY > 0) {
    // S'assurer que l'animation est arrêtée avant de quitter la page d'accueil
    if (window.HomeAnimator) {
      console.log("🖱️ Défilement depuis l'accueil : préparation à l'arrêt de l'animation");
    }
  }
}, { passive: true });

// Gestionnaire pour les touches fléchées
window.addEventListener('keydown', function(e) {
  // Si on est sur la page d'accueil et qu'on utilise les flèches bas/droite
  if (document.querySelector('#home.active') && (e.key === 'ArrowDown' || e.key === 'ArrowRight')) {
    // S'assurer que l'animation est arrêtée avant de quitter la page d'accueil
    if (window.HomeAnimator) {
      console.log("⌨️ Navigation clavier depuis l'accueil : préparation à l'arrêt de l'animation");
    }
  }
});

// Ajouter dans main.js
window.debugROMY = {
  logNavigationMethod: function(method) {
    console.log(`Navigation effectuée via: ${method}`);
  },
  verifyHomeState: function() {
    const homeSection = document.getElementById('home');
    const romyElement = document.getElementById('romy');
    const bg1Element = document.getElementById('bg1');

    console.log("État du DOM:");
    console.log(`- Section home active: ${homeSection.classList.contains('active')}`);
    console.log(`- Body home-active: ${document.body.classList.contains('home-active')}`);
    console.log(`- Élément ROMY visible: ${window.getComputedStyle(romyElement).visibility}`);
    console.log(`- Élément BG1 visible: ${window.getComputedStyle(bg1Element).visibility}`);
    console.log(`- Image BG1: ${bg1Element.style.backgroundImage}`);
  }
};
