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

    // Vérifier si une section est active et démarrer la vidéo correspondante
    checkActiveSection();

    console.log(`VideoPlayer initialisé avec ${players.length} lecteurs`);
  }

  // Vérifier les sections actives et lancer les vidéos
  function checkActiveSection() {
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
      const player = activeSection.querySelector('.minimal-player');
      if (player) {
        const video = player.querySelector('video');
        if (video && video.paused) {
          console.log(`Démarrage automatique vidéo (section active): ${video.id}`);
          video.play().catch(err => console.error("Erreur de lecture automatique:", err));

          // Mettre à jour l'état du bouton play/pause
          updatePlayButton(player, false);
        }
      }
    }
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
        video.preload = "auto"; // Changer en "auto" pour charger plus rapidement
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

    // Vérifier si les contrôles existent
    const controls = player.querySelector('.controls');

    if (!video) {
      console.error('Élément vidéo non trouvé dans le lecteur', player);
      return;
    }

    // S'assurer que l'élément vidéo a un ID
    if (!video.id) {
      video.id = 'video-' + Math.random().toString(36).substr(2, 9);
    }

    // On ne force plus la pause pour permettre l'autoplay
    video.preload = "auto";

    // Créer et ajouter le bouton play/pause minimaliste
    if (controls) {
      // Chercher si un bouton play existe déjà
      let playButton = controls.querySelector('.play-button');

      // Si le bouton n'existe pas, le créer
      if (!playButton) {
        playButton = document.createElement('div');
        playButton.className = 'play-button';
        playButton.style.position = 'relative';
        playButton.style.width = '24px';
        playButton.style.height = '24px';
        playButton.style.cursor = 'pointer';
        playButton.style.marginRight = '10px';

        // Créer l'icône de lecture (triangle)
        const playIcon = document.createElement('div');
        playIcon.className = 'play-icon';
        playIcon.style.position = 'absolute';
        playIcon.style.top = '50%';
        playIcon.style.left = '50%';
        playIcon.style.transform = 'translate(-40%, -50%)';
        playIcon.style.width = '0';
        playIcon.style.height = '0';
        playIcon.style.borderTop = '6px solid transparent';
        playIcon.style.borderBottom = '6px solid transparent';
        playIcon.style.borderLeft = '10px solid white';
        playIcon.style.opacity = '0.8';
        playIcon.style.transition = 'opacity 0.2s ease';

        // Créer l'icône de pause (deux barres)
        const pauseIcon = document.createElement('div');
        pauseIcon.className = 'pause-icon';
        pauseIcon.style.position = 'absolute';
        pauseIcon.style.top = '50%';
        pauseIcon.style.left = '50%';
        pauseIcon.style.transform = 'translate(-50%, -50%)';
        pauseIcon.style.width = '10px';
        pauseIcon.style.height = '12px';
        pauseIcon.style.opacity = '0.8';
        pauseIcon.style.transition = 'opacity 0.2s ease';
        pauseIcon.style.display = 'none';

        // Créer les deux barres de l'icône pause
        const pauseBar1 = document.createElement('div');
        pauseBar1.style.position = 'absolute';
        pauseBar1.style.left = '0';
        pauseBar1.style.top = '0';
        pauseBar1.style.width = '3px';
        pauseBar1.style.height = '100%';
        pauseBar1.style.backgroundColor = 'white';

        const pauseBar2 = document.createElement('div');
        pauseBar2.style.position = 'absolute';
        pauseBar2.style.right = '0';
        pauseBar2.style.top = '0';
        pauseBar2.style.width = '3px';
        pauseBar2.style.height = '100%';
        pauseBar2.style.backgroundColor = 'white';

        // Assembler les éléments
        pauseIcon.appendChild(pauseBar1);
        pauseIcon.appendChild(pauseBar2);
        playButton.appendChild(playIcon);
        playButton.appendChild(pauseIcon);

        // Ajouter le bouton au début des contrôles
        controls.insertBefore(playButton, controls.firstChild);

        // Effet de survol
        playButton.addEventListener('mouseenter', () => {
          playIcon.style.opacity = '1';
          pauseIcon.style.opacity = '1';
        });

        playButton.addEventListener('mouseleave', () => {
          playIcon.style.opacity = '0.8';
          pauseIcon.style.opacity = '0.8';
        });

        // Ajouter la fonctionnalité play/pause
        playButton.addEventListener('click', (e) => {
          e.stopPropagation();

          if (video.paused) {
            // Lecture
            video.play().catch(err => console.error("Erreur de lecture:", err));
            // Mettre à jour l'interface
            updatePlayButton(player, false);
          } else {
            // Pause
            video.pause();
            // Mettre à jour l'interface
            updatePlayButton(player, true);
          }
        });
      }
    }

    // Écouter les événements de la vidéo pour mettre à jour le bouton
    video.addEventListener('play', () => {
      updatePlayButton(player, false);
    });

    video.addEventListener('pause', () => {
      updatePlayButton(player, true);
    });

    video.addEventListener('ended', () => {
      updatePlayButton(player, true);
    });

    // Observer si le lecteur est dans une section active
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          const section = player.closest('.section');
          if (section && section.classList.contains('active')) {
            // La section est devenue active, lancer la vidéo
            if (video.paused) {
              console.log(`Section active détectée, démarrage vidéo: ${video.id}`);
              video.play().catch(err => console.error("Erreur de lecture (section active):", err));
              updatePlayButton(player, false);
            }
          } else if (section && !section.classList.contains('active')) {
            // La section n'est plus active, mettre en pause
            if (!video.paused) {
              console.log(`Section inactive détectée, pause vidéo: ${video.id}`);
              video.pause();
              updatePlayButton(player, true);
            }
            // Toujours couper le son quand la section n'est plus active
            if (!video.muted) {
              video.muted = true;
              updateMuteButton(muteButton, true);
            }
          }
        }
      });
    });

    // Observer les changements de classe sur la section parente
    const section = player.closest('.section');
    if (section) {
      observer.observe(section, { attributes: true });

      // Lancer immédiatement si la section est déjà active
      if (section.classList.contains('active') && video.paused) {
        console.log(`Section déjà active, démarrage vidéo: ${video.id}`);
        video.play().catch(err => console.error("Erreur de lecture (section déjà active):", err));
        updatePlayButton(player, false);
      }
    }

    // Fonction pour mettre à jour l'interface du bouton play/pause
    function updatePlayButton(player, isPaused) {
      const playButton = player.querySelector('.play-button');
      if (!playButton) return;

      const playIcon = playButton.querySelector('.play-icon');
      const pauseIcon = playButton.querySelector('.pause-icon');

      if (playIcon && pauseIcon) {
        if (isPaused) {
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        } else {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
        }
      }
    }

    // ACTIVATION DU SON AU SURVOL
    player.addEventListener('mouseenter', () => {
      // Vérifier que la vidéo est dans une section active
      if (!player.closest('.section.active')) return;

      // Lecture
      if (video.paused) {
        console.log(`Démarrage vidéo (survol): ${video.id}`);
        video.play().catch(err => console.error("Erreur de lecture (survol):", err));
        updatePlayButton(player, false);
      }

      // Activer le son automatiquement au survol
      if (video.muted) {
        console.log(`Activation du son (survol): ${video.id}`);
        video.muted = false;

        // Restaurer le volume précédent ou utiliser 0.5 par défaut
        if (!video.dataset.lastVolume || parseFloat(video.dataset.lastVolume) <= 0) {
          video.volume = 0.5; // Volume à 50% par défaut
        } else {
          video.volume = parseFloat(video.dataset.lastVolume);
        }

        // Mettre à jour l'interface
        updateMuteButton(muteButton, false);
      }
    });

    // Couper le son quand la souris quitte le lecteur
    player.addEventListener('mouseleave', () => {
      if (!video.muted) {
        // Sauvegarder le volume actuel
        video.dataset.lastVolume = video.volume.toString();

        console.log(`Désactivation du son (sortie): ${video.id}`);
        video.muted = true;

        // Mettre à jour l'interface
        updateMuteButton(muteButton, true);
      }

      // Ne pas mettre la vidéo en pause pour permettre la lecture continue
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

    // Configuration du bouton de volume style Vimeo
    if (muteButton) {
      // S'assurer que le bouton a la position relative pour le positionnement absolu à l'intérieur
      muteButton.style.position = 'relative';

      // Créer le contrôle de volume horizontal style Vimeo
      const volumeControl = document.createElement('div');
      volumeControl.className = 'volume-control-vimeo';
      volumeControl.style.position = 'absolute';
      volumeControl.style.right = 'calc(100% + 10px)'; // 10px à gauche du bouton
      volumeControl.style.top = '50%';
      volumeControl.style.transform = 'translateY(-50%)';
      volumeControl.style.width = '80px'; // Longueur fixe
      volumeControl.style.height = '4px'; // Hauteur fixe
      volumeControl.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      volumeControl.style.borderRadius = '2px';
      volumeControl.style.cursor = 'pointer';
      volumeControl.style.display = 'none'; // Caché par défaut
      volumeControl.style.transition = 'opacity 0.2s ease';
      volumeControl.style.opacity = '0';

      // Créer l'indicateur de niveau de volume
      const volumeLevel = document.createElement('div');
      volumeLevel.className = 'volume-level-indicator';
      volumeLevel.style.position = 'absolute';
      volumeLevel.style.left = '0';
      volumeLevel.style.top = '0';
      volumeLevel.style.width = '50%'; // 50% par défaut (correspondant à 0.5)
      volumeLevel.style.height = '100%';
      volumeLevel.style.backgroundColor = 'white';
      volumeLevel.style.borderRadius = '2px';
      volumeLevel.style.transition = 'width 0.1s ease';

      // Ajouter le curseur
      const volumeHandle = document.createElement('div');
      volumeHandle.className = 'volume-handle';
      volumeHandle.style.position = 'absolute';
      volumeHandle.style.right = '0';
      volumeHandle.style.top = '50%';
      volumeHandle.style.transform = 'translate(50%, -50%)';
      volumeHandle.style.width = '12px';
      volumeHandle.style.height = '12px';
      volumeHandle.style.borderRadius = '50%';
      volumeHandle.style.backgroundColor = 'white';
      volumeHandle.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.3)';

      // Ajouter l'indicateur de niveau au contrôle
      volumeLevel.appendChild(volumeHandle);
      volumeControl.appendChild(volumeLevel);

      // Ajouter le contrôle de volume au player
      muteButton.parentNode.appendChild(volumeControl);

      // Fonction pour mettre à jour l'interface du bouton mute
      function updateMuteButton(button, isMuted) {
        if (!button) return;

        const volumeOn = button.querySelector('.volume-on');
        const volumeOff = button.querySelector('.volume-off');

        if (volumeOn && volumeOff) {
          volumeOn.style.display = isMuted ? 'none' : 'block';
          volumeOff.style.display = isMuted ? 'block' : 'none';
        }
      }

      // Fonction pour mettre à jour l'interface du contrôle de volume
      function updateVolumeUI(volume) {
        // Mettre à jour la largeur de l'indicateur de niveau
        volumeLevel.style.width = (volume * 100) + '%';
      }

      // Gestionnaire pour la visibilité du contrôle de volume
      muteButton.addEventListener('mouseenter', () => {
        volumeControl.style.display = 'block';
        setTimeout(() => {
          volumeControl.style.opacity = '1';
        }, 10); // Petit délai pour l'animation CSS
      });

      muteButton.addEventListener('mouseleave', (e) => {
        // Vérifier si la souris est entrée dans le contrôle de volume
        const rect = volumeControl.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          volumeControl.style.opacity = '0';
          setTimeout(() => {
            if (volumeControl.style.opacity === '0') {
              volumeControl.style.display = 'none';
            }
          }, 200); // Durée de transition
        }
      });

      volumeControl.addEventListener('mouseenter', () => {
        volumeControl.style.display = 'block';
        volumeControl.style.opacity = '1';
      });

      volumeControl.addEventListener('mouseleave', () => {
        if (!muteButton.matches(':hover')) {
          volumeControl.style.opacity = '0';
          setTimeout(() => {
            if (volumeControl.style.opacity === '0') {
              volumeControl.style.display = 'none';
            }
          }, 200); // Durée de transition
        }
      });

      // Gestionnaire de clic sur le contrôle de volume
      volumeControl.addEventListener('click', (e) => {
        e.stopPropagation();

        // Calculer la position relative du clic (0 à 1)
        const rect = volumeControl.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) / rect.width;
        const newVolume = Math.max(0, Math.min(1, clickPos)); // Limiter entre 0 et 1

        // Mettre à jour le volume de la vidéo
        video.volume = newVolume;
        video.dataset.lastVolume = newVolume.toString();

        // Gérer l'état muet
        if (newVolume === 0) {
          video.muted = true;
          updateMuteButton(muteButton, true);
        } else {
          video.muted = false;
          updateMuteButton(muteButton, false);
        }

        // Mettre à jour l'interface
        updateVolumeUI(newVolume);
      });

      // Permettre de faire glisser le curseur pour ajuster le volume
      volumeControl.addEventListener('mousedown', function(e) {
        e.preventDefault();

        const startDrag = (e) => {
          const rect = volumeControl.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          const newVolume = Math.max(0, Math.min(1, clickPos));

          video.volume = newVolume;
          video.dataset.lastVolume = newVolume.toString();

          if (newVolume === 0) {
            video.muted = true;
            updateMuteButton(muteButton, true);
          } else {
            video.muted = false;
            updateMuteButton(muteButton, false);
          }

          updateVolumeUI(newVolume);
        };

        const moveHandler = (e) => {
          startDrag(e);
        };

        const upHandler = () => {
          document.removeEventListener('mousemove', moveHandler);
          document.removeEventListener('mouseup', upHandler);
        };

        // Initialiser le glissement
        startDrag(e);

        // Ajouter les écouteurs pour le mouvement et le relâchement
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
      });

      // Bouton mute - bascule le son
      muteButton.addEventListener('click', (e) => {
        e.stopPropagation();

        if (video.muted) {
          // Réactiver le son
          video.muted = false;

          // Restaurer le volume précédent ou définir une valeur par défaut
          if (video.dataset.lastVolume && parseFloat(video.dataset.lastVolume) > 0) {
            video.volume = parseFloat(video.dataset.lastVolume);
          } else {
            video.volume = 0.5; // 50% par défaut
          }

          // Mettre à jour les interfaces
          updateMuteButton(muteButton, false);
          updateVolumeUI(video.volume);
        } else {
          // Sauvegarder le volume actuel avant de couper le son
          video.dataset.lastVolume = video.volume.toString();

          // Couper le son
          video.muted = true;

          // Mettre à jour les interfaces
          updateMuteButton(muteButton, true);
        }
      });

      // Initialiser l'interface
      updateMuteButton(muteButton, true); // Muet par défaut
      updateVolumeUI(video.volume); // Niveau de volume initial
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
        updatePlayButton(player, true);

        // Couper le son de toutes les vidéos non actives
        if (!video.muted) {
          video.dataset.lastVolume = video.volume.toString();
          video.muted = true;

          // Mettre à jour l'interface du bouton mute
          const muteButton = player.querySelector('.mute-button');
          if (muteButton) {
            const volumeOn = muteButton.querySelector('.volume-on');
            const volumeOff = muteButton.querySelector('.volume-off');
            if (volumeOn && volumeOff) {
              volumeOn.style.display = 'none';
              volumeOff.style.display = 'block';
            }
          }
        }
      } else if (section.id === sectionId && video.paused) {
        // Démarrer la vidéo de la section active
        console.log(`Démarrage vidéo (nouvelle section active): ${video.id}`);
        video.play().catch(err => console.error("Erreur de lecture (changement section):", err));
        updatePlayButton(player, false);
      }
    });
  }

  // Fonction pour mettre à jour l'interface du bouton play/pause
  function updatePlayButton(player, isPaused) {
    if (!player) return;

    const playButton = player.querySelector('.play-button');
    if (!playButton) return;

    const playIcon = playButton.querySelector('.play-icon');
    const pauseIcon = playButton.querySelector('.pause-icon');

    if (playIcon && pauseIcon) {
      if (isPaused) {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      } else {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      }
    }
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

    // Mettre à jour l'interface du bouton play
    updatePlayButton(player, true);

    // Sauvegarder le volume avant de couper le son
    if (!video.muted) {
      video.dataset.lastVolume = video.volume.toString();
    }

    video.muted = true; // S'assurer que le son est coupé à la réinitialisation

    // Réinitialiser la barre de progression
    const progress = player.querySelector('.progress');
    if (progress) {
      progress.style.width = '0%';
    }

    // Mettre à jour l'interface du bouton mute
    const muteButton = player.querySelector('.mute-button');
    if (muteButton) {
      const volumeOn = muteButton.querySelector('.volume-on');
      const volumeOff = muteButton.querySelector('.volume-off');
      if (volumeOn && volumeOff) {
        volumeOn.style.display = 'none';
        volumeOff.style.display = 'block';
      }
    }
  }

  // API publique
  return {
    init: init,
    pauseAllExcept: pauseAllExcept,
    resetActiveVideo: resetActiveVideo,
    checkActiveSection: checkActiveSection
  };
})();

/**
 * Effet de pellicule vidéo - Version corrigée pour votre HTML
 */

// Fonction autonome à intégrer dans votre video-player.js
function createFilmEffect() {
  console.log("Création de l'effet pellicule...");

  // Attendre le chargement complet du DOM pour éviter les erreurs
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFilmEffect);
  } else {
    initFilmEffect();
  }

  // Fonction principale d'initialisation
  function initFilmEffect() {
    // Sélectionner tous les conteneurs de vidéo
    const videoContainers = document.querySelectorAll('.project-video-container');
    console.log(`Trouvé ${videoContainers.length} conteneurs vidéo`);

    // Pour chaque conteneur vidéo
    videoContainers.forEach((container) => {
      // Trouver le lecteur vidéo
      const player = container.querySelector('.minimal-player');
      if (!player) {
        console.warn("Lecteur vidéo non trouvé dans un conteneur");
        return;
      }

      // Vérifier si l'effet est déjà appliqué (éviter les duplications)
      if (container.querySelector('.film-clone')) {
        console.log("Effet déjà appliqué, ignoré");
        return;
      }

      // Créer le clone supérieur
      const topClone = document.createElement('div');
      topClone.className = 'film-clone film-clone-top';

      // Créer le clone inférieur
      const bottomClone = document.createElement('div');
      bottomClone.className = 'film-clone film-clone-bottom';

      // Cloner le lecteur pour les deux positions
      const topPlayerClone = player.cloneNode(true);
      const bottomPlayerClone = player.cloneNode(true);

      // Ajouter les lecteurs clonés à leurs conteneurs
      topClone.appendChild(topPlayerClone);
      bottomClone.appendChild(bottomPlayerClone);

      // Ajouter les clones au conteneur principal
      container.appendChild(topClone);
      container.appendChild(bottomClone);

      // Trouver les vidéos pour synchronisation
      const originalVideo = player.querySelector('video');
      const topVideo = topPlayerClone.querySelector('video');
      const bottomVideo = bottomPlayerClone.querySelector('video');

      // S'assurer que les vidéos existent
      if (originalVideo && topVideo && bottomVideo) {
        console.log("Vidéos trouvées, préparation de la synchronisation");

        // Rendre les vidéos clonées muettes
        topVideo.muted = true;
        bottomVideo.muted = true;

        // Supprimer les IDs pour éviter les conflits
        if (topVideo.id) topVideo.removeAttribute('id');
        if (bottomVideo.id) bottomVideo.removeAttribute('id');

        // Synchroniser la lecture
        originalVideo.addEventListener('play', function() {
          // Synchroniser la position temporelle
          topVideo.currentTime = originalVideo.currentTime;
          bottomVideo.currentTime = originalVideo.currentTime;

          // Démarrer la lecture des clones
          topVideo.play().catch(e => console.log("Erreur de lecture clone haut:", e));
          bottomVideo.play().catch(e => console.log("Erreur de lecture clone bas:", e));
        });

        // Synchroniser la pause
        originalVideo.addEventListener('pause', function() {
          topVideo.pause();
          bottomVideo.pause();
        });

        // Synchroniser lors du déplacement dans la timeline
        originalVideo.addEventListener('seeked', function() {
          topVideo.currentTime = originalVideo.currentTime;
          bottomVideo.currentTime = originalVideo.currentTime;
        });
      } else {
        console.warn("Impossible de trouver toutes les vidéos pour la synchronisation");
      }
    });

    console.log("Effet pellicule appliqué avec succès");
  }
}

// Intégration avec le module VideoPlayer existant
// Ajouter cette ligne à la fin de votre fichier video-player.js
if (window.VideoPlayer) {
  // Si le module VideoPlayer existe déjà
  VideoPlayer.createFilmEffect = createFilmEffect;

  // Modification de la fonction d'initialisation
  const originalInit = VideoPlayer.init;
  VideoPlayer.init = function() {
    // Appeler l'initialisation originale
    originalInit.call(this);

    // Ajouter un délai pour s'assurer que tout est initialisé
    setTimeout(() => {
      // Appliquer l'effet pellicule
      this.createFilmEffect();

      // Vérifier les sections actives après l'application de l'effet pellicule
      this.checkActiveSection();
    }, 500);
  };
} else {
  // Si le module n'existe pas encore, créer une fonction autonome
  window.initFilmEffect = createFilmEffect;
  // À appeler manuellement ou dans un event listener
  document.addEventListener('DOMContentLoaded', createFilmEffect);
}

// Ajouter un événement pour détecter les changements de section
document.addEventListener('DOMContentLoaded', function() {
  // Rechercher tous les éléments qui pourraient déclencher un changement de section
  const triggers = document.querySelectorAll('[data-section]');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      // Laisser le temps à la section de devenir active
      setTimeout(() => {
        if (window.VideoPlayer) {
          window.VideoPlayer.checkActiveSection();
        }
      }, 100);
    });
  });
});

// Exporter le module
window.VideoPlayer = VideoPlayer;
