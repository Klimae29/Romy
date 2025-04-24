/**
 * main.js - Fonctions principales du site ROMY
 */

// Fonctions de navigation
function navigateToSection(sectionId) {
  const sections = document.querySelectorAll('.section');

  sections.forEach((section, index) => {
    if (section.id === sectionId) {
      sections.forEach(s => s.classList.remove('active'));
      section.classList.add('active');

      // Changer la couleur de fond du body
      const bgColor = section.dataset.bgColor || '#000';
      document.body.style.backgroundColor = bgColor;

      // Mettre à jour l'index de section courante
      currentSectionIndex = index;

      // Pause toutes les vidéos sauf celle de la section active
      pauseAllVideosExcept(sectionId);
    }
  });
}

// Pause toutes les vidéos sauf celle spécifiée et réinitialise les vidéos
function pauseAllVideosExcept(sectionId) {
  const players = document.querySelectorAll('.minimal-player');

  players.forEach(player => {
    const videoSection = player.closest('.section');
    const video = player.querySelector('video');
    const progress = player.querySelector('.progress');

    if (videoSection && videoSection.id !== sectionId) {
      try {
        if (!video.paused) {
          video.pause();
        }
        // Réinitialiser les vidéos inactives au début
        video.currentTime = 0;
        if (progress) {
          progress.style.width = '0%';
        }
      } catch (e) {
        console.log('Erreur lors de la pause vidéo:', e);
      }
    } else if (videoSection && videoSection.id === sectionId) {
      // Réinitialiser la vidéo active au début
      video.currentTime = 0;
      if (progress) {
        progress.style.width = '0%';
      }
      // Optionnel: Lecture automatique de la vidéo active
      // video.play().catch(e => console.log('Erreur de lecture automatique:', e));
    }
  });
}

// Mise à jour des sections visible
function updateSections() {
  const sections = document.querySelectorAll('.section');

  sections.forEach((section, index) => {
    if (index === currentSectionIndex) {
      section.classList.add('active');

      // Changer la couleur de fond du body
      const bgColor = section.dataset.bgColor || '#000';
      document.body.style.backgroundColor = bgColor;
    } else {
      section.classList.remove('active');
    }
  });

  // Pause toutes les vidéos sauf celle de la section active
  if (sections[currentSectionIndex]) {
    pauseAllVideosExcept(sections[currentSectionIndex].id);
  }
}

// Fonction de défilement vers le haut
function scrollUp() {
  if (isScrolling || currentSectionIndex <= 0) return;

  isScrolling = true;

  currentSectionIndex--;
  updateSections();

  setTimeout(() => {
    isScrolling = false;
  }, scrollDelay);
}

// Fonction de défilement vers le bas
function scrollDown() {
  const sections = document.querySelectorAll('.section');
  if (isScrolling || currentSectionIndex >= sections.length - 1) return;

  isScrolling = true;

  currentSectionIndex++;
  updateSections();

  setTimeout(() => {
    isScrolling = false;
  }, scrollDelay);
}

// Gestion des touches clavier
function handleKeyNavigation(e) {
  if (isScrolling) return;

  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    scrollDown();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    scrollUp();
  }
}

// Gestion de la molette de souris
function handleWheelNavigation(e) {
  e.preventDefault(); // Empêcher le défilement standard

  if (isScrolling) return;

  // Utiliser un délai court pour détecter les mouvements rapides de la molette
  clearTimeout(wheelTimeout);

  wheelTimeout = setTimeout(() => {
    if (e.deltaY > 0) {
      // Défilement vers le bas
      scrollDown();
    } else {
      // Défilement vers le haut
      scrollUp();
    }
  }, 50); // Petit délai pour éviter les déclenchements multiples
}

// Gestion des événements tactiles
function handleTouchStart(e) {
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
  if (isScrolling) return;

  const touchEndY = e.changedTouches[0].screenY;
  const diff = touchStartY - touchEndY;

  // Seuil de swipe
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      // Swipe vers le haut (passage à la section suivante)
      scrollDown();
    } else {
      // Swipe vers le bas (passage à la section précédente)
      scrollUp();
    }
  }
}

// Initialisation des lecteurs vidéo minimalistes
function initMinimalVideoPlayers() {
  const players = document.querySelectorAll('.minimal-player');

  players.forEach(player => {
    const video = player.querySelector('video');
    const progressBar = player.querySelector('.progress-bar');
    const progress = player.querySelector('.progress');
    const muteButton = player.querySelector('.mute-button');
    const volumeOn = muteButton.querySelector('.volume-on');
    const volumeOff = muteButton.querySelector('.volume-off');
    const fullscreenButton = player.querySelector('.fullscreen-button');
    const fullscreenEnter = fullscreenButton.querySelector('.fullscreen-enter');
    const fullscreenExit = fullscreenButton.querySelector('.fullscreen-exit');

    // Démarrer la vidéo au survol
    player.addEventListener('mouseenter', () => {
      if (player.closest('.section.active')) {
        video.play().catch(e => console.log('Impossible de lire la vidéo:', e));
      }
    });

    // Pause la vidéo quand la souris quitte la zone
    player.addEventListener('mouseleave', () => {
      video.pause();
    });

    // Mise à jour de la barre de progression
    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        progress.style.width = `${percent}%`;
      }
    });

    // Navigation dans la vidéo en cliquant sur la barre de progression
    progressBar.addEventListener('click', (e) => {
      e.stopPropagation(); // Empêcher la propagation pour éviter le déclenchement d'autres événements
      const pos = (e.pageX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      video.currentTime = pos * video.duration;
    });

    // Gestion du son
    muteButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Empêcher la propagation pour éviter le déclenchement d'autres événements
      video.muted = !video.muted;
      if (video.muted) {
        volumeOn.style.display = 'none';
        volumeOff.style.display = 'block';
      } else {
        volumeOn.style.display = 'block';
        volumeOff.style.display = 'none';
      }
    });

    // Gestion du plein écran
    fullscreenButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Empêcher la propagation pour éviter le déclenchement d'autres événements

      if (!document.fullscreenElement) {
        if (player.requestFullscreen) {
          player.requestFullscreen();
        } else if (player.webkitRequestFullscreen) { /* Safari */
          player.webkitRequestFullscreen();
        } else if (player.msRequestFullscreen) { /* IE11 */
          player.msRequestFullscreen();
        }
        fullscreenEnter.style.display = 'none';
        fullscreenExit.style.display = 'block';
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
          document.msExitFullscreen();
        }
        fullscreenEnter.style.display = 'block';
        fullscreenExit.style.display = 'none';
      }
    });
  });

  // Gestion des changements d'état du plein écran
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
  document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
  document.addEventListener('MSFullscreenChange', handleFullscreenChange); // IE11
}

// Gestion du changement d'état du plein écran
function handleFullscreenChange() {
  const players = document.querySelectorAll('.minimal-player');

  players.forEach(player => {
    const fullscreenEnter = player.querySelector('.fullscreen-enter');
    const fullscreenExit = player.querySelector('.fullscreen-exit');

    if (document.fullscreenElement === player ||
        document.webkitFullscreenElement === player ||
        document.mozFullScreenElement === player ||
        document.msFullscreenElement === player) {
      fullscreenEnter.style.display = 'none';
      fullscreenExit.style.display = 'block';
    } else {
      fullscreenEnter.style.display = 'block';
      fullscreenExit.style.display = 'none';
    }
  });
}
