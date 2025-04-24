/**
 * romy.js - Code optimisé pour le site du réalisateur ROMY
 */

// Utilitaires communs
const Utils = {
  // Sélecteur d'éléments DOM avec mise en cache
  select(selector, parent = document) {
    return parent.querySelector(selector);
  },

  selectAll(selector, parent = document) {
    return parent.querySelectorAll(selector);
  },

  // Gestion du plein écran cross-browser
  toggleFullscreen(element) {
    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  },

  // Détection de plein écran
  isFullscreen(element) {
    return document.fullscreenElement === element ||
           document.webkitFullscreenElement === element ||
           document.mozFullScreenElement === element ||
           document.msFullscreenElement === element;
  },

  // Helper pour les événements
  addEvent(target, events, handler, options) {
    if (typeof events === 'string') events = [events];
    events.forEach(event => {
      target.addEventListener(event, handler, options);
    });
  },

  // Gestion du debounce pour les événements comme le scroll
  debounce(func, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
};

// Module pour l'animation de la page d'accueil

// Module pour l'animation de la page d'accueil
const HomeAnimator = {
  // Configuration
  pairs: [
    { font: "'Comic Sans MS', cursive", image: "index_univ_1.png" },
    { font: "'Amatic SC', cursive", image: "index_univ_2.png" },
    { font: "'Anton', sans-serif", image: "index_univ_3.png" },
    { font: "'Orbitron', sans-serif", image: "index_univ_4.png" },
    { font: "'Lucida Console', monospace", image: "index_univ_5.png" },
    { font: "'Pacifico', cursive", image: "index_univ_6.png" },
    { font: "'Trebuchet MS', sans-serif", image: "index_univ_7.png" },
    { font: "'Impact', sans-serif", image: "index_univ_8.png" },
    { font: "'Brush Script MT', cursive", image: "index_univ_9.png" }
  ],

  // État
  state: {
    index: 0,
    toggle: false,
    animationStarted: false,
    animationInterval: null
  },

  // Initialisation
  init() {
    // Utiliser querySelector au lieu de getElementById pour être sûr
    this.romyTitle = document.querySelector('#romy');

    // Vérifier si l'élément a été trouvé
    if (!this.romyTitle) {
      console.error("ERREUR: L'élément #romy n'a pas été trouvé!");
      // Tentative alternative de sélection
      this.romyTitle = document.querySelector('.home-title');
      console.log("Tentative alternative:", this.romyTitle);
    }

    this.bg1 = document.querySelector('#bg1') || this.createBackgroundLayer('bg1');
    this.bg2 = document.querySelector('#bg2') || this.createBackgroundLayer('bg2');

    // Supprimer toute classe ou style qui pourrait interférer
    if (this.romyTitle) {
      // Supprimer les transitions et styles potentiellement conflictuels
      this.romyTitle.style.transition = "none";
      this.romyTitle.style.willChange = "font-family";

      // S'assurer que !important dans le CSS ne bloque pas nos changements
      this.romyTitle.setAttribute('style', 'transition: none !important; will-change: font-family !important;');
    }

    // Préchargement des images
    this.preloadImages();

    // Initialiser l'affichage
    this.setupInitialDisplay();

    // Configurer les gestionnaires d'événements
    this.setupEventListeners();

    console.log("✅ Animation de la page d'accueil initialisée !");
  },

  // Créer un calque d'arrière-plan si nécessaire
  createBackgroundLayer(id) {
    const bg = document.createElement('div');
    bg.id = id;
    bg.classList.add('bg-layer');

    Object.assign(bg.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      transition: "opacity 0.8s ease",
      zIndex: -1,
      opacity: 0,
    });

    document.body.appendChild(bg);
    return bg;
  },

  // Précharger les images
  preloadImages() {
    this.pairs.forEach(({ image }) => {
      const img = new Image();
      img.src = `../assets/images/${image}`;
    });
  },

  // Configurer l'affichage initial
  setupInitialDisplay() {
    // Première police et image
    if (this.romyTitle) {
      this.romyTitle.style.fontFamily = this.pairs[0].font;
    }
    if (this.bg1) {
      this.bg1.style.backgroundImage = `url(../assets/images/${this.pairs[0].image})`;
      this.bg1.style.opacity = 1;
    }
    if (this.romyTitle) {
      this.romyTitle.classList.add("appear");
    }
  },

  // Configurer les gestionnaires d'événements
  setupEventListeners() {
    // Démarrer l'animation au premier scroll
    window.addEventListener("wheel", () => {
      this.startAnimation();
    }, { once: true });

    // Également démarrer l'animation sur click pour mobile
    if (this.romyTitle) {
      this.romyTitle.addEventListener('click', () => {
        this.startAnimation();
      });
    }

    // Ajouter un gestionnaire pour le bouton qui permet de démarrer manuellement
    const startButton = document.getElementById('startAnimation');
    if (startButton) {
      startButton.addEventListener('click', () => {
        this.startAnimation();
      });
    }
  },

  // Technique de force-redraw pour s'assurer que le changement de police est visible
  forceRedraw(element) {
    // Ces opérations forcent le navigateur à redessiner l'élément
    const display = element.style.display;
    element.style.display = 'none';
    void element.offsetHeight; // Force un reflow
    element.style.display = display;
  },

  // Créer un élément temporaire avec le texte pour précharger la police
  preloadFont(fontFamily, text) {
    const preloader = document.createElement('div');
    preloader.style.fontFamily = fontFamily;
    preloader.style.position = 'absolute';
    preloader.style.left = '-9999px';
    preloader.style.visibility = 'hidden';
    preloader.textContent = text || 'ROMY';
    document.body.appendChild(preloader);

    // Supprimer après un court délai
    setTimeout(() => {
      document.body.removeChild(preloader);
    }, 100);
  },

  // Changer la police et l'arrière-plan
  changeBackgroundAndFont() {
    if (!this.romyTitle) return;

    const current = this.pairs[this.state.index];

    // Précharger la police pour s'assurer qu'elle est disponible
    this.preloadFont(current.font);

    // Technique 1: Changement direct avec forceRedraw
    this.romyTitle.style.fontFamily = current.font;
    this.forceRedraw(this.romyTitle);

    // Technique 2: Animation Flash pour rendre le changement plus visible
    this.romyTitle.classList.add('font-changing');
    setTimeout(() => {
      this.romyTitle.classList.remove('font-changing');
    }, 50);

    // Technique 3: Changer le contenu temporairement pour forcer un redraw
    const originalText = this.romyTitle.textContent;
    this.romyTitle.textContent = originalText + ' ';
    setTimeout(() => {
      this.romyTitle.textContent = originalText;
    }, 10);

    // Changer l'arrière-plan (garder cette partie identique)
    const currentBg = this.state.toggle ? this.bg1 : this.bg2;
    const nextBg = this.state.toggle ? this.bg2 : this.bg1;

    if (nextBg && current.image) {
      nextBg.style.backgroundImage = `url(../assets/images/${current.image})`;
      nextBg.style.opacity = 1;
    }

    if (currentBg) {
      currentBg.style.opacity = 0;
    }

    // Mettre à jour l'index pour le prochain changement
    this.state.toggle = !this.state.toggle;
    this.state.index = (this.state.index + 1) % this.pairs.length;

    // Log pour debug
    console.log(`Police changée pour: ${current.font}`);
  },

  // Démarrer l'animation
  startAnimation() {
    if (this.state.animationStarted) return;

    console.log("Démarrage de l'animation...");

    // Forcer la suppression de tout attribut !important qui pourrait interférer
    if (this.romyTitle) {
      this.romyTitle.setAttribute('style', 'transition: none !important; will-change: font-family !important;');
    }

    this.state.animationStarted = true;

    // Utiliser un intervalle plus court (50ms) pour un changement plus rapide
    this.state.animationInterval = setInterval(() => {
      this.changeBackgroundAndFont();
    }, 50); // Intervalle très court pour des changements rapides

    console.log("✅ Animation de la page d'accueil démarrée !");
  },

  // Arrêter l'animation
  stopAnimation() {
    if (this.state.animationInterval) {
      clearInterval(this.state.animationInterval);
      this.state.animationInterval = null;
    }
    this.state.animationStarted = false;
    console.log("Animation arrêtée.");
  }
}; // ACCOLADE FERMANTE MANQUANTE AJOUTÉE

// Module de navigation entre sections
const SectionNavigator = {
  // Configuration
  config: {
    scrollDelay: 1000,
    wheelThreshold: 50
  },

  // État
  state: {
    currentIndex: 0,
    isScrolling: false,
    touchStartY: 0,
    wheelTimeout: null
  },

  // Initialisation
  init() {
    // Éléments DOM
    this.sections = Utils.selectAll('.section');

    // Définir la section active initiale
    const activeSection = Utils.select('.section.active');
    if (activeSection) {
      this.setBackgroundColor(activeSection);

      // Trouver l'index de la section active
      this.sections.forEach((section, index) => {
        if (section === activeSection) {
          this.state.currentIndex = index;
        }
      });
    }

    // Initialiser les gestionnaires d'événements
    this.initEventListeners();
  },

  // Configuration des événements
  initEventListeners() {
    // Événements de navigation
    Utils.addEvent(window, 'wheel', this.handleWheel.bind(this), { passive: false });
    Utils.addEvent(window, 'keydown', this.handleKeyboard.bind(this));
    Utils.addEvent(window, ['touchstart', 'touchend'], this.handleTouch.bind(this));

    // Empêcher les clics pendant le défilement
    document.addEventListener('click', (e) => {
      if (this.state.isScrolling) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });

    // Transitionend pour chaque section
    this.sections.forEach(section => {
      section.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'opacity' && section.classList.contains('active')) {
          VideoPlayer.resetActiveVideo(section);
        }
      });
    });
  },

  // Navigation vers une section spécifique
  navigateTo(sectionId) {
    this.sections.forEach((section, index) => {
      if (section.id === sectionId) {
        // Si nous quittons la section d'accueil, arrêter l'animation
        if (this.state.currentIndex === 0 && index !== 0 && HomeAnimator) {
          HomeAnimator.stopAnimation();
        }

        // Mettre à jour les classes
        this.sections.forEach(s => s.classList.remove('active'));
        section.classList.add('active');

        // Mise à jour du reste
        this.state.currentIndex = index;
        this.setBackgroundColor(section);
        VideoPlayer.pauseAllExcept(sectionId);
      }
    });
  },

  // Définir la couleur de fond
  setBackgroundColor(section) {
    const bgColor = section.dataset.bgColor || '#000';
    document.body.style.backgroundColor = bgColor;
  },

  // Fonction commune pour défiler
  scroll(direction) {
    if (this.state.isScrolling) return;

    const newIndex = this.state.currentIndex + direction;
    if (newIndex < 0 || newIndex >= this.sections.length) return;

    // Si nous quittons la section d'accueil, arrêter l'animation
    if (this.state.currentIndex === 0 && newIndex !== 0 && HomeAnimator) {
      HomeAnimator.stopAnimation();
    }

    this.state.isScrolling = true;
    this.state.currentIndex = newIndex;
    this.updateActiveSection();

    setTimeout(() => {
      this.state.isScrolling = false;
    }, this.config.scrollDelay);
  },

  // Défilement vers le haut (wrapper pour scroll)
  scrollUp() {
    this.scroll(-1);
  },

  // Défilement vers le bas (wrapper pour scroll)
  scrollDown() {
    this.scroll(1);
  },

  // Mise à jour de la section active
  updateActiveSection() {
    const targetSection = this.sections[this.state.currentIndex];

    if (!targetSection) return;

    // Utiliser le contrôleur de transition pour une animation améliorée
    if (window.TransitionController) {
      const success = TransitionController.transitionTo(targetSection);

      // Si la transition a réussi, mettre en pause les vidéos
      if (success && targetSection) {
        VideoPlayer.pauseAllExcept(targetSection.id);
      }
    } else {
      // Fallback à l'approche originale
      this.sections.forEach((section, index) => {
        if (index === this.state.currentIndex) {
          section.classList.add('active');
          this.setBackgroundColor(section);
        } else {
          section.classList.remove('active');
        }
      });

      if (targetSection) {
        VideoPlayer.pauseAllExcept(targetSection.id);
      }
    }
  },

  // Gestionnaires d'événements
  handleWheel(e) {
    e.preventDefault();
    if (this.state.isScrolling) return;

    // Si nous sommes sur la page d'accueil et que l'animation n'a pas encore commencé
    if (this.state.currentIndex === 0 && HomeAnimator && !HomeAnimator.state.animationStarted) {
      HomeAnimator.startAnimation();
      return;
    }

    clearTimeout(this.state.wheelTimeout);
    this.state.wheelTimeout = setTimeout(() => {
      if (e.deltaY > 0) {
        this.scrollDown();
      } else {
        this.scrollUp();
      }
    }, this.config.wheelThreshold);
  },

  handleKeyboard(e) {
    if (this.state.isScrolling) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      this.scrollDown();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      this.scrollUp();
    }
  },

  handleTouch(e) {
    if (e.type === 'touchstart') {
      this.state.touchStartY = e.changedTouches[0].screenY;
    } else if (e.type === 'touchend') {
      if (this.state.isScrolling) return;

      const touchEndY = e.changedTouches[0].screenY;
      const diff = this.state.touchStartY - touchEndY;

      // Si nous sommes sur la page d'accueil et que l'animation n'a pas encore commencé
      if (this.state.currentIndex === 0 && HomeAnimator && !HomeAnimator.state.animationStarted) {
        HomeAnimator.startAnimation();
        return;
      }

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.scrollDown();
        } else {
          this.scrollUp();
        }
      }
    }
  }
};

// Module de gestion des lecteurs vidéo
const VideoPlayer = {
  // Initialisation des lecteurs vidéo
  init() {
    this.players = Utils.selectAll('.minimal-player');
    this.videoPositions = new Map(); // Pour stocker les positions des vidéos
    this.playersData = new Map();  // Pour stocker les références aux éléments
    this.isInFullscreenTransition = false; // Flag pour gérer les transitions de plein écran

    this.players.forEach(player => {
      this.setupPlayer(player);
    });

    // Gestionnaires d'événements plein écran (utilisant le helper)
    Utils.addEvent(document,
      ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'],
      this.handleFullscreenChange.bind(this)
    );

    // Préchargement des vidéos
    this.preloadVideos();

    // Persistance des positions même après un changement de page
    window.addEventListener('beforeunload', () => {
      // Sauvegarder toutes les positions actuelles
      this.players.forEach(player => {
        const elements = this.playersData.get(player);
        if (elements && elements.video) {
          this.videoPositions.set(elements.video, elements.video.currentTime);
        }
      });
    });
  },

  // Configuration d'un lecteur individuel
  setupPlayer(player) {
    // Sélectionner et mettre en cache les éléments du lecteur
    const elements = {
      video: Utils.select('video', player),
      progressBar: Utils.select('.progress-bar', player),
      progress: Utils.select('.progress', player),
      muteButton: Utils.select('.mute-button', player),
      volumeOn: Utils.select('.volume-on', player.querySelector('.mute-button')),
      volumeOff: Utils.select('.volume-off', player.querySelector('.mute-button')),
      fullscreenButton: Utils.select('.fullscreen-button', player),
      fullscreenEnter: Utils.select('.fullscreen-enter', player.querySelector('.fullscreen-button')),
      fullscreenExit: Utils.select('.fullscreen-exit', player.querySelector('.fullscreen-button'))
    };

    // Stocker les références dans Map pour accès rapide
    this.playersData.set(player, elements);

    // Initialiser l'entrée pour cette vidéo dans la Map des positions
    if (elements.video) {
      this.videoPositions.set(elements.video, 0);
    }

    // Lecture au survol (préservation du timecode)
    player.addEventListener('mouseenter', () => {
      if (player.closest('.section.active')) {
        const video = elements.video;
        if (video) {
          // Récupérer la position sauvegardée
          const savedPosition = this.videoPositions.get(video);
          if (savedPosition !== undefined && savedPosition > 0) {
            // Si on a une position sauvegardée, l'utiliser
            video.currentTime = savedPosition;
          }
          // Sinon on laisse la position actuelle (important pour le plein écran)

          video.play().catch(e => console.log('Impossible de lire la vidéo:', e));

          // Double vérification pour s'assurer que la position reste correcte
          const targetTime = savedPosition !== undefined && savedPosition > 0 ? savedPosition : video.currentTime;
          setTimeout(() => {
            if (Math.abs(video.currentTime - targetTime) > 0.5) {
              video.currentTime = targetTime;
            }
          }, 50);
        }
      }
    });

    // Pause quand la souris quitte (sauvegarder la position sans réinitialiser)
    player.addEventListener('mouseleave', () => {
      const video = elements.video;
      if (video) {
        // Sauvegarder la position actuelle
        this.videoPositions.set(video, video.currentTime);
        video.pause();

        // S'assurer que la vidéo garde sa position actuelle
        const currentTime = video.currentTime;
        // Utiliser setTimeout pour s'assurer que la position reste après la pause
        setTimeout(() => {
          if (video.currentTime !== currentTime) {
            video.currentTime = currentTime;
          }
        }, 50);
      }
    });

    // Mise à jour de la barre de progression (mise à jour continue de la position)
    elements.video.addEventListener('timeupdate', () => {
      if (elements.video.duration) {
        const percent = (elements.video.currentTime / elements.video.duration) * 100;
        elements.progress.style.width = `${percent}%`;

        // Mettre à jour la position sauvegardée à chaque frame
        if (elements.video.currentTime > 0) {
          this.videoPositions.set(elements.video, elements.video.currentTime);
        }
      }
    });

    // Navigation dans la vidéo
    elements.progressBar.addEventListener('click', (e) => {
      e.stopPropagation();
      const pos = (e.pageX - elements.progressBar.getBoundingClientRect().left) / elements.progressBar.offsetWidth;
      elements.video.currentTime = pos * elements.video.duration;

      // Mettre à jour la position sauvegardée
      this.videoPositions.set(elements.video, elements.video.currentTime);
    });

    // Gestion du son
    elements.muteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.video.muted = !elements.video.muted;
      this.updateMuteIcon(player);
    });

    // Gestion du plein écran (préserver la position)
    elements.fullscreenButton.addEventListener('click', (e) => {
      e.stopPropagation();
      // Sauvegarder la position actuelle avant de basculer en plein écran
      const currentTime = elements.video.currentTime;
      const wasPlaying = !elements.video.paused;

      Utils.toggleFullscreen(player);

      // S'assurer que la vidéo garde sa position après le changement de plein écran
      setTimeout(() => {
        elements.video.currentTime = currentTime;
        if (wasPlaying) {
          elements.video.play().catch(e => console.log('Impossible de reprendre la lecture:', e));
        }
      }, 100);
    });
  },

  // Mise à jour de l'icône de son
  updateMuteIcon(player) {
    const elements = this.playersData.get(player);
    elements.volumeOn.style.display = elements.video.muted ? 'none' : 'block';
    elements.volumeOff.style.display = elements.video.muted ? 'block' : 'none';
  },

  // Mise à jour de l'icône de plein écran
  updateFullscreenIcon(player) {
    const elements = this.playersData.get(player);
    const isFullscreen = Utils.isFullscreen(player);

    elements.fullscreenEnter.style.display = isFullscreen ? 'none' : 'block';
    elements.fullscreenExit.style.display = isFullscreen ? 'block' : 'none';
  },

  // Préchargement des vidéos
  preloadVideos() {
    this.players.forEach(player => {
      const elements = this.playersData.get(player);
      if (elements.video) {
        elements.video.load();
      }
    });
  },

  // Mettre en pause toutes les vidéos sauf celle de la section spécifiée
  pauseAllExcept(sectionId) {
    this.players.forEach(player => {
      const videoSection = player.closest('.section');
      if (!videoSection) return;

      const elements = this.playersData.get(player);

      if (videoSection.id !== sectionId) {
        try {
          if (!elements.video.paused) {
            // Sauvegarder la position avant de mettre en pause
            this.videoPositions.set(elements.video, elements.video.currentTime);
            elements.video.pause();
          }
        } catch (e) {
          console.log('Erreur lors de la pause vidéo:', e);
        }
      }
    });
  },

  // Réinitialiser la vidéo active (uniquement lors du changement de section)
  resetActiveVideo(section) {
    const player = Utils.select('.minimal-player', section);
    if (!player) return;

    const elements = this.playersData.get(player);
    if (elements && elements.video) {
      // Réinitialiser la vidéo et sa position sauvegardée
      elements.video.currentTime = 0;
      this.videoPositions.set(elements.video, 0);

      if (elements.progress) {
        elements.progress.style.width = '0%';
      }
    }
  },

  // Gestion du changement d'état du plein écran
  handleFullscreenChange() {
    this.players.forEach(player => {
      const elements = this.playersData.get(player);
      if (elements && elements.video) {
        // Récupérer la position sauvegardée
        const savedPosition = this.videoPositions.get(elements.video);
        if (savedPosition !== undefined && savedPosition > 0) {
          // Restaurer la position après le changement de plein écran
          elements.video.currentTime = savedPosition;
        }
      }
      this.updateFullscreenIcon(player);
    });
  }
};

// Module pour la gestion du menu
const MenuController = {
  init() {
    this.elements = {
      menuToggle: Utils.select('#menuToggle'),
      menuPanel: Utils.select('#menuPanel'),
      menuClose: Utils.select('#menuClose'),
      menuLinks: Utils.selectAll('.menu-items a')
    };

    this.setupEventListeners();
  },

  setupEventListeners() {
    // Ouvrir le menu
    this.elements.menuToggle.addEventListener('click', () => {
      this.elements.menuPanel.classList.add('active');
    });

    // Fermer le menu
    this.elements.menuClose.addEventListener('click', () => {
      this.elements.menuPanel.classList.remove('active');
    });

    // Navigation via les liens du menu
    this.elements.menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.elements.menuPanel.classList.remove('active');

        const targetId = link.getAttribute('href').substring(1);
        SectionNavigator.navigateTo(targetId);
      });
    });
  }
};

// Module de transition amélioré
const TransitionController = {
  // Configuration
  config: {
    animationDuration: 800, // en ms, doit correspondre aux durées CSS
    minTransitionDelay: 1000 // délai minimum entre les transitions
  },

  // État
  state: {
    isTransitioning: false,
    currentSection: null,
    previousSection: null
  },

  // Initialisation
  init() {
    // Références DOM
    this.sections = Utils.selectAll('.section');

    // Observer la fin des transitions
    this.setupTransitionObserver();

    // État initial
    this.state.currentSection = Utils.select('.section.active');
  },

  // Configuration de l'observateur pour les transitions
  setupTransitionObserver() {
    this.sections.forEach(section => {
      section.addEventListener('transitionend', (e) => {
        // Ne réagir qu'aux transitions d'opacité de la section elle-même
        if (e.target === section && e.propertyName === 'opacity') {
          // Si la section devient visible
          if (section.classList.contains('active')) {
            this.state.isTransitioning = false;
            this.onTransitionComplete(section);
          }
        }
      });
    });
  },

  // Gestion de la transition vers une nouvelle section
  transitionTo(targetSection) {
    if (this.state.isTransitioning) return false;

    // Marquer comme en transition
    this.state.isTransitioning = true;

    // Stocker la référence à la section précédente
    this.state.previousSection = this.state.currentSection;
    this.state.currentSection = targetSection;

    // Appliquer les classes pour déclencher les transitions CSS
    if (this.state.previousSection) {
      this.state.previousSection.classList.remove('active');
      this.state.previousSection.classList.add('leaving');
    }

    targetSection.classList.add('active');

    // Mettre à jour la couleur de fond
    this.updateBackgroundColor(targetSection);

    // Délai de sécurité pour débloquer les transitions
    setTimeout(() => {
      // Nettoyer la section précédente
      if (this.state.previousSection) {
        this.state.previousSection.classList.remove('leaving');
      }

      // Marquer comme transition terminée si aucune animation n'a été déclenchée
      if (this.state.isTransitioning) {
        this.state.isTransitioning = false;
      }
    }, this.config.animationDuration + 100);

    return true;
  },

  // Mise à jour de la couleur de fond
  updateBackgroundColor(section) {
    const bgColor = section.dataset.bgColor || '#000';
    document.body.style.backgroundColor = bgColor;
  },

  // Actions à exécuter une fois la transition terminée
  onTransitionComplete(section) {
    // Démarrer la vidéo de la section active si elle existe
    const videoPlayer = section.querySelector('video');
    if (videoPlayer) {
      videoPlayer.currentTime = 0; // Remettre à zéro
      videoPlayer.play().catch(e => console.warn('Impossible de lire la vidéo automatiquement:', e));
    }

    // Déclencher un événement personnalisé
    const event = new CustomEvent('sectionTransitionComplete', {
      detail: {
        section: section,
        previousSection: this.state.previousSection
      }
    });
    document.dispatchEvent(event);
  }
};

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ Script JS chargé !");

  // Attendre que les polices soient chargées
  document.fonts.ready.then(() => {
    console.log("✅ Toutes les polices Google Fonts sont chargées !");

    // Initialiser les contrôleurs
    if (Utils.select('#romy')) {
      HomeAnimator.init();
    }

    SectionNavigator.init();
    VideoPlayer.init();
    MenuController.init();
    TransitionController.init();

    // Animation de chargement initial
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 500);
  });
});

// Gestion de redimensionnement avec debounce
window.addEventListener('resize', Utils.debounce(() => {
  // Code de gestion du redimensionnement si nécessaire
}, 250));
