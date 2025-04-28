/**
 * menu-module.js - Gestion du menu de navigation
 * Ce module gère l'affichage et le comportement du menu
 */

const MenuModule = (function() {
  // Éléments DOM
  let menuToggle = null;
  let menuClose = null;
  let menuPanel = null;
  let menuItems = null;

  // Initialisation
  function init() {
    console.log('Initialisation du MenuModule...');

    // Sélection des éléments DOM
    menuToggle = document.getElementById('menuToggle');
    menuClose = document.getElementById('menuClose');
    menuPanel = document.getElementById('menuPanel');
    menuItems = document.querySelectorAll('.menu-items a');

    if (!menuToggle || !menuPanel) {
      console.error('Éléments du menu non trouvés dans le DOM');
      return false;
    }

    // Configuration des événements
    setupEventListeners();

    console.log('✅ MenuModule initialisé avec succès');
    return true;
  }

  // Configuration des écouteurs d'événements
  function setupEventListeners() {
    // Ouverture du menu
    if (menuToggle && menuPanel) {
      menuToggle.addEventListener('click', openMenu);
    }

    // Fermeture du menu
    if (menuClose && menuPanel) {
      menuClose.addEventListener('click', closeMenu);
    }

    // Navigation par liens du menu
    if (menuItems) {
      menuItems.forEach(link => {
        link.addEventListener('click', handleMenuItemClick);
      });
    }

    // Fermeture du menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuPanel.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // Ouvrir le menu
  function openMenu() {
    if (!menuPanel) return;

    menuPanel.classList.add('active');

    // Animation d'entrée pour les éléments du menu
    animateMenuItems(true);
  }

  // Fermer le menu
  function closeMenu() {
    if (!menuPanel) return;

    menuPanel.classList.remove('active');
  }

  // Animation des éléments du menu
  function animateMenuItems(isEntering) {
    if (!menuItems) return;

    menuItems.forEach((item, index) => {
      if (isEntering) {
        // Animation d'entrée
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';

        setTimeout(() => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, 50 + (index * 50)); // Délai progressif
      } else {
        // Animation de sortie si nécessaire
        item.style.transition = 'none';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }
    });
  }

  // Gestionnaire de clic sur un élément du menu
  function handleMenuItemClick(e) {
    e.preventDefault();

    // Récupérer l'ID de la section cible
    const targetId = this.getAttribute('href').substring(1);

    // Fermer le menu
    closeMenu();

    // Naviguer vers la section (avec délai pour animation de fermeture)
    setTimeout(() => {
      if (window.SectionNavigator) {
        window.SectionNavigator.navigateTo(targetId);
      } else {
        // Fallback si SectionNavigator n'est pas disponible
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
          });
          targetSection.classList.add('active');
        }
      }
    }, 300);
  }

  // API publique
  return {
    init: init,
    openMenu: openMenu,
    closeMenu: closeMenu
  };
})();

// Exporter le module
window.MenuModule = MenuModule;
