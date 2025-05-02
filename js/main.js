// main.js - Script principal d'initialisation du site ROMY

document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ DOM chargé !");

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
    // Démarrer les modules principaux dans l'ordre
    // Mais vérifier que chaque module existe avant de l'initialiser

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

  // Configurer les liens du menu
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      menuPanel.classList.remove('active');

      // Naviguer vers la section si SectionNavigator est disponible
      if (window.SectionNavigator) {
        window.SectionNavigator.navigateTo(targetId);
      } else {
        console.warn("SectionNavigator non disponible");
        // Fallback si le navigateur de section n'est pas disponible
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
          });
          targetSection.classList.add('active');
        }
      }
    });
  });

  console.log("✅ Menu configuré avec succès");
}
