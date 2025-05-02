/**
 * video-player.js - Module de gestion des lecteurs vidéo
 * Ce module gère les contrôles et le comportement des lecteurs vidéo dans les sections
 */

const VideoPlayer = (function() {
  // Éléments DOM
  let players = [];

  // Initialisation
  function init() {
    console.log("Initialisation du VideoPlayer");

    // Rechercher tous les lecteurs vidéo
    players = document.querySelectorAll('.minimal-player');

    // Configurer chaque lecteur
    players.forEach(player => {
      setupPlayer(player);
    });

    // Charger les vidéos avec des posters temporaires
    loadVideos();

    console.log(`VideoPlayer initialisé avec ${players.length} lecteurs`);
  }

  // Charger correctement les vidéos
  function loadVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      // S'assurer que la vidéo a une source
      const source = video.querySelector('source');
      if (source && source.src) {
        // S'assurer que le poster est défini
        if (video.poster === "/api/placeholder/1280/720" || !video.poster) {
          // Utiliser un poster par défaut
          video.poster = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        }

        // Charger la vidéo avec les attributs corrects
        video.muted = true; // Muet par défaut pour éviter les problèmes d'autoplay
        video.preload = "metadata";
        video.playsInline = true;
      }
    });
  }

  // Configuration d'un lecteur individuel
  function setupPlayer(player) {
    // Sélectionner les éléments essentiels
    const video = player.querySelector('video');
    const progressBar = player.querySelector('.progress-bar');
    const progress = player.querySelector('.progress');
    const muteButton = player.querySelector('.mute-button');
    const fullscreenButton = player.querySelector('.fullscreen-button');

    if (!video) {
      console.error('Élément vidéo non trouvé dans le lecteur', player);
      return;
    }

    // S'assurer que l'élément vidéo a un ID
    if (!video.id) {
      video.id = 'video-' + Math.random().toString(36).substr(2, 9);
    }

    // S'assurer que la vidéo est initialement en pause et prête à être chargée
    video.pause();
    video.preload = "auto";

    // Gestionnaire pour le survol
    player.addEventListener('mouseenter', () => {
      // Vérifier que la vidéo est dans une section active
      if (!player.closest('.section.active')) return;

      // Lecture
      if (video.paused) {
        console.log(`Démarrage vidéo: ${video.id}`);
        video.play().catch(err => console.error("Erreur de lecture:", err));
      }
    });

    // Gestionnaire pour la sortie de souris
    player.addEventListener('mouseleave', () => {
      if (!video.paused) {
        console.log(`Pause vidéo: ${video.id}`);
        video.pause();
      }
    });

    // Mise à jour de la barre de progression
    if (progressBar && progress) {
      video.addEventListener('timeupdate', () => {
        if (video.duration) {
          const percent = (video.currentTime / video.duration) * 100;
          progress.style.width = `${percent}%`;
        }
      });

      // Navigation dans la vidéo
      progressBar.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
      });
    }

    // Bouton son
    if (muteButton) {
      muteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;

        // Mise à jour de l'icône
        const volumeOn = muteButton.querySelector('.volume-on');
        const volumeOff = muteButton.querySelector('.volume-off');

        if (volumeOn && volumeOff) {
          volumeOn.style.display = video.muted ? 'none' : 'block';
          volumeOff.style.display = video.muted ? 'block' : 'none';
        }
      });
    }

    // Bouton plein écran
    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!document.fullscreenElement) {
          player.requestFullscreen().catch(err => {
            console.error("Erreur plein écran:", err);
          });
        } else {
          document.exitFullscreen();
        }
      });
    }
  }

  // Mettre en pause toutes les vidéos sauf celle de la section spécifiée
  function pauseAllExcept(sectionId) {
    players.forEach(player => {
      const video = player.querySelector('video');
      if (!video) return;

      const section = player.closest('.section');
      if (!section) return;

      if (section.id !== sectionId && !video.paused) {
        console.log(`Pause vidéo (changement section): ${video.id}`);
        video.pause();
      }
    });
  }

  // Réinitialiser la vidéo active
  function resetActiveVideo(section) {
    if (!section) return;

    const player = section.querySelector('.minimal-player');
    if (!player) return;

    const video = player.querySelector('video');
    if (!video) return;

    // Réinitialiser la vidéo
    if (!video.paused) {
      video.pause();
    }

    video.currentTime = 0;

    // Réinitialiser la barre de progression
    const progress = player.querySelector('.progress');
    if (progress) {
      progress.style.width = '0%';
    }
  }

  // API publique
  return {
    init: init,
    pauseAllExcept: pauseAllExcept,
    resetActiveVideo: resetActiveVideo
  };
})();

// Exporter le module
window.VideoPlayer = VideoPlayer;
