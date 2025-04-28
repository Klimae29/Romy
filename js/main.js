/**
 * main.js - Script principal d'initialisation
 * Ce fichier coordonne l'initialisation de tous les modules du site
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initialisation du site ROMY...');

  // Initialisation du menu
  initMenu();

  // Initialiser les modules dans le bon ordre
  const initSequence = async () => {
    try {
      // 1. Contrôleur de transitions en premier (dépendance de base)
      await initModule(TransitionController);

      // 2. Contrôleur d'animations (utilise TransitionController)
      await initModule(AnimationController);

      // 3. Navigateur de sections (utilise TransitionController)
      await initModule(SectionNavigator);

      // 4. Lecteur vidéo
      await initModule(VideoPlayer);

      // 5. Animateur de la page d'accueil (en dernier car moins critique)
      await initModule(HomeAnimator);

      // Marquer le site comme chargé
      document.body.classList.add('loaded');

      console.log('✅ Initialisation du site terminée avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    }
  };

  initSequence();
});

// Fonction utilitaire pour initialiser un module avec gestion d'erreur
function initModule(module) {
  return new Promise((resolve, reject) => {
    try {
      if (!module) {
        console.warn(`Module non trouvé, chargement ignoré`);
        resolve();
        return;
      }

      const moduleName = module.name || 'Module inconnu';
      console.log(`Initialisation de ${moduleName}...`);

      const result = module.init();

      // Si le module renvoie une promesse, on l'attend
      if (result instanceof Promise) {
        result.then(() => {
          console.log(`✅ ${moduleName} initialisé avec succès`);
          resolve();
        }).catch(err => {
          console.error(`❌ Erreur lors de l'initialisation de ${moduleName}:`, err);
          // On résout quand même pour ne pas bloquer la suite
          resolve();
        });
      } else {
        console.log(`✅ ${moduleName} initialisé avec succès`);
        resolve();
      }
    } catch (error) {
      console.error('Erreur d\'initialisation:', error);
      // On résout quand même pour ne pas bloquer la suite
      resolve();
    }
  });
}

// Initialisation du menu
function initMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const menuPanel = document.getElementById('menuPanel');
  const menuLinks = document.querySelectorAll('.menu-items a');

  if (menuToggle && menuPanel) {
    menuToggle.addEventListener('click', function() {
      menuPanel.classList.add('active');
    });
  }

  if (menuClose && menuPanel) {
    menuClose.addEventListener('click', function() {
      menuPanel.classList.remove('active');
    });
  }

  // Configurer les liens du menu
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      // Récupérer l'ID de la section cible depuis l'attribut href
      const targetId = this.getAttribute('href').substring(1);

      // Fermer le menu
      menuPanel.classList.remove('active');

      // Naviguer vers la section
      if (window.SectionNavigator) {
        window.SectionNavigator.navigateTo(targetId);
      }
    });
  });

  console.log('✅ Menu initialisé');
}
