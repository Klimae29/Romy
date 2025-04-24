/**
 * script.js - Initialisation et événements du site ROMY
 */

// Variables globales
let currentSectionIndex = 0;
let isScrolling = false;
let touchStartY = 0;
let wheelTimeout;
const scrollDelay = 1000; // Délai entre chaque défilement en millisecondes

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
  // Éléments DOM
  const menuToggle = document.getElementById('menuToggle');
  const menuPanel = document.getElementById('menuPanel');
  const menuClose = document.getElementById('menuClose');
  const menuLinks = document.querySelectorAll('.menu-items a');

  // Initialiser la couleur de fond pour la première section
  const firstSection = document.querySelector('.section.active');
  if (firstSection && firstSection.dataset.bgColor) {
    document.body.style.backgroundColor = firstSection.dataset.bgColor;
  }

  // Événements du menu
  menuToggle.addEventListener('click', () => {
    menuPanel.classList.add('active');
  });

  menuClose.addEventListener('click', () => {
    menuPanel.classList.remove('active');
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      menuPanel.classList.remove('active');

      // Navigation vers la section
      const targetId = link.getAttribute('href').substring(1);
      navigateToSection(targetId);
    });
  });

  // Événement de la molette de souris
  window.addEventListener('wheel', handleWheelNavigation, { passive: false });

  // Événements clavier
  window.addEventListener('keydown', handleKeyNavigation);

  // Événements tactiles
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);

  // Gestion des vidéos lors du changement de section
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'opacity' && section.classList.contains('active')) {
        const video = section.querySelector('video');
        if (video) {
          // Optionnel: Lecture automatique de la vidéo
          // video.play().catch(e => console.log('Erreur de lecture automatique:', e));
        }
      }
    });
  });

  // Initialiser les lecteurs vidéo minimalistes
  initMinimalVideoPlayers();

  // Préchargement des vidéos (à implémenter quand les vraies vidéos seront disponibles)
  function preloadVideos() {
    const videos = document.querySelectorAll('.minimal-player video');
    videos.forEach(video => {
      // Optionnel: Préchargement
      video.load();
    });
  }

  // Appel de la fonction de préchargement
  preloadVideos();

  // Révéler progressivement le site (animation initiale)
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 500);
});

// Gestion de redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  // Ajuster les éléments si nécessaire lors du redimensionnement
});

// Empêcher les clics accidentels pendant le défilement
document.addEventListener('click', (e) => {
  if (isScrolling) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
});

 // Gestion des vidéos lors du changement de section
 const sections = document.querySelectorAll('.section');
 sections.forEach(section => {
   section.addEventListener('transitionend', (e) => {
     if (e.propertyName === 'opacity' && section.classList.contains('active')) {
       const player = section.querySelector('.minimal-player');
       if (player) {
         const video = player.querySelector('video');
         const progress = player.querySelector('.progress');

         if (video) {
           // Réinitialiser la vidéo au début
           video.currentTime = 0;
           if (progress) {
             progress.style.width = '0%';
           }
           // Optionnel: Lecture automatique de la vidéo
           // video.play().catch(e => console.log('Erreur de lecture automatique:', e));
         }
       }
     }
   });
 });
