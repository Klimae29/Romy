/**
 * script-index.js - Script pour la page d'accueil
 */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
  // Éléments DOM
  const menuToggle = document.getElementById('menuToggle');
  const menuPanel = document.getElementById('menuPanel');
  const menuClose = document.getElementById('menuClose');
  const menuLinks = document.querySelectorAll('.menu-items a');

  // Animation d'entrée de la page
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 500);

  // Événements du menu
  menuToggle.addEventListener('click', () => {
    menuPanel.classList.add('active');
  });

  menuClose.addEventListener('click', () => {
    menuPanel.classList.remove('active');
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuPanel.classList.remove('active');
    });
  });

  // Animation du bouton d'entrée
  const enterButton = document.querySelector('.enter-button');
  if (enterButton) {
    enterButton.addEventListener('mouseenter', () => {
      enterButton.style.boxShadow = '0 5px 15px rgba(255, 255, 255, 0.1)';
    });

    enterButton.addEventListener('mouseleave', () => {
      enterButton.style.boxShadow = 'none';
    });

    // Animation lors du clic
    enterButton.addEventListener('click', (e) => {
      // Optionnel: Animation de transition lors du clic avant la navigation
      const event = e;

      enterButton.style.opacity = '0';
      enterButton.style.transform = 'scale(0.9)';

      document.querySelector('.home-title').style.opacity = '0';
      document.querySelector('.home-title').style.transform = 'translateY(-30px)';

      // Légère pause avant la navigation pour voir l'animation
      setTimeout(() => {
        window.location.href = enterButton.getAttribute('href');
      }, 300);

      e.preventDefault();
    });
  }
});
