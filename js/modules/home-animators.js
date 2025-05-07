/**
 * home-animator.js - Module pour l'animation de la page d'accueil
 * Version corrigée - isole complètement l'animation à la section d'accueil
 */

const HomeAnimator = (function() {
  // Configuration
  const config = {
    animationInterval: 100,      // Intervalle entre les changements
    scrollLockDuration: 5000,    // Verrouillage du défilement pendant 5 secondes
    homeId: 'home'               // ID de la section d'accueil
  };

  // Paires police/image avec les polices
  const pairs = [
    { font: "'Playfair Display', serif", image: "index_univ_1.png" },
    { font: "'Amatic SC', cursive", image: "index_univ_2.png" },
    { font: "'Anton', sans-serif", image: "index_univ_3.png" },
    { font: "'Orbitron', sans-serif", image: "index_univ_4.png" },
    { font: "'Lucida Console', monospace", image: "index_univ_5.png" },
    { font: "'Pacifico', cursive", image: "index_univ_6.png" },
    { font: "'Trebuchet MS', sans-serif", image: "index_univ_7.png" },
    { font: "'Impact', sans-serif", image: "index_univ_8.png" },
    { font: "'Poppins', sans-serif", image: "index_univ_9.png" }
  ];

  // État
  let state = {
    index: 0,
    toggle: false,
    animationStarted: false,
    animationInterval: null,
    animationStartTime: null,
    preloadedImages: [],         // Pour stocker les images préchargées
    isDestroyed: false,          // Nouvel état pour savoir si l'animation est détruite
    animationEnabled: true       // État pour activer/désactiver l'animation
  };

  // Éléments DOM
  let romyTitle = null;
  let bg1 = null;
  let bg2 = null;
  let homeSection = null;

  // Observer pour détecter les changements de section
  let sectionObserver = null;

  // Fonction pour obtenir le chemin correct des images
  function getImagePath(imageName) {
    return `../../assets/images/${imageName}`;
  }

  // Fonction utilitaires
  function forceRedraw(element) {
    if (!element) return;
    const display = element.style.display;
    element.style.display = 'none';
    void element.offsetHeight;
    element.style.display = display;
  }

  function createBackgroundLayer(id) {
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
  }

  function preloadFont(fontFamily, text) {
    const preloader = document.createElement('div');
    preloader.style.fontFamily = fontFamily;
    preloader.style.position = 'absolute';
    preloader.style.left = '-9999px';
    preloader.style.visibility = 'hidden';
    preloader.textContent = text || 'ROMY';
    document.body.appendChild(preloader);

    setTimeout(() => {
      document.body.removeChild(preloader);
    }, 100);
  }

  function preloadImages() {
    console.log("Préchargement des images...");

    // N'exécuter le préchargement que si l'animation est encore activée
    if (state.isDestroyed || !state.animationEnabled) {
      console.log("Animation désactivée, préchargement annulé");
      return;
    }

    // Vider le tableau de préchargement précédent
    state.preloadedImages = [];

    // Précharger toutes les images une seule fois
    pairs.forEach(({ image }, index) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Image ${index+1}/${pairs.length} préchargée: ${image}`);
      };
      img.onerror = () => {
        console.warn(`⚠️ Impossible de charger l'image: ${getImagePath(image)}`);
      };
      img.src = getImagePath(image);
      state.preloadedImages.push(img); // Garder une référence pour éviter le garbage collection
    });
  }

  function changeBackgroundAndFont() {
    // Vérifier si l'animation a été détruite ou désactivée
    if (state.isDestroyed || !state.animationEnabled) {
      console.log("Animation désactivée, changement annulé");
      return;
    }

    // Vérifier si on est toujours sur la page d'accueil
    if (!isHomeActive()) {
      console.log("La section d'accueil n'est plus active, arrêt de l'animation");
      stopAnimation();
      return;
    }

    if (!romyTitle) return;

    const current = pairs[state.index];

    // Précharger la police
    preloadFont(current.font);

    // Changement de police avec techniques diverses
    romyTitle.style.fontFamily = current.font;
    forceRedraw(romyTitle);
    romyTitle.classList.add('font-changing');
    setTimeout(() => {
      romyTitle.classList.remove('font-changing');
    }, 100);

    // Changer l'arrière-plan
    const currentBg = state.toggle ? bg1 : bg2;
    const nextBg = state.toggle ? bg2 : bg1;

    if (nextBg && current.image) {
      const imagePath = getImagePath(current.image);
      nextBg.style.backgroundImage = `url(${imagePath})`;
      nextBg.style.opacity = 1;
      nextBg.style.visibility = 'visible';
      nextBg.style.zIndex = '-1';
    }

    if (currentBg) {
      currentBg.style.opacity = 0;
    }

    // Mise à jour pour le prochain changement
    state.toggle = !state.toggle;
    state.index = (state.index + 1) % pairs.length;
  }

  function startAnimation() {
    // Ne pas démarrer si l'animation est détruite ou désactivée
    if (state.isDestroyed || !state.animationEnabled) {
      console.log("Animation désactivée, démarrage annulé");
      return;
    }

    // Ne pas démarrer si déjà en cours ou si la page d'accueil n'est pas active
    if (state.animationStarted || !isHomeActive()) {
      console.log("Animation non démarrée: déjà en cours ou section inactive");
      return;
    }

    console.log("Démarrage de l'animation...");

    if (romyTitle) {
      romyTitle.setAttribute('style', 'transition: none !important; will-change: font-family !important;');
    }

    state.animationStarted = true;
    state.animationStartTime = Date.now();

    // Utiliser l'intervalle configuré
    state.animationInterval = setInterval(() => {
      changeBackgroundAndFont();
    }, config.animationInterval);

    console.log("✅ Animation de la page d'accueil démarrée !");
  }

  function stopAnimation() {
    if (state.animationInterval) {
      clearInterval(state.animationInterval);
      state.animationInterval = null;
    }

    state.animationStarted = false;

    // Masquer complètement les éléments
    if (bg1) {
      bg1.style.opacity = "0";
      bg1.style.visibility = "hidden";
      bg1.style.zIndex = "-10";
    }

    if (bg2) {
      bg2.style.opacity = "0";
      bg2.style.visibility = "hidden";
      bg2.style.zIndex = "-10";
    }

    if (romyTitle) {
      romyTitle.classList.remove("appear");
      romyTitle.style.opacity = "0";
      romyTitle.style.visibility = "hidden";
      romyTitle.style.zIndex = "-10";
    }

    console.log("Animation arrêtée et éléments masqués.");
  }

  // NOUVELLE FONCTION: Détruire complètement l'animation
  function destroyAnimation() {
    console.log("Destruction complète de l'animation...");

    // Arrêter l'animation en cours
    if (state.animationInterval) {
      clearInterval(state.animationInterval);
      state.animationInterval = null;
    }

    // Marquer comme détruit
    state.isDestroyed = true;
    state.animationEnabled = false;
    state.animationStarted = false;

    // Libérer les références aux images préchargées
    state.preloadedImages = [];

    // Arrêter l'observateur
    if (sectionObserver) {
      sectionObserver.disconnect();
      sectionObserver = null;
    }

    // Supprimer les événements
    if (romyTitle) {
      romyTitle.removeEventListener('click', startAnimation);
    }

    // Nettoyer les éléments visuels
    if (bg1) {
      bg1.style.opacity = "0";
      bg1.style.visibility = "hidden";
      bg1.style.backgroundImage = "";
    }

    if (bg2) {
      bg2.style.opacity = "0";
      bg2.style.visibility = "hidden";
      bg2.style.backgroundImage = "";
    }

    console.log("✅ Animation complètement détruite et nettoyée.");
  }

  function handleScroll(event) {
    // Si l'animation n'est pas en cours, permettre le défilement
    if (!state.animationStarted || state.isDestroyed || !state.animationEnabled) {
      return true;
    }

    // Si l'animation est en cours et que le temps minimum n'est pas écoulé
    if (Date.now() - state.animationStartTime < config.scrollLockDuration) {
      // Empêcher le défilement standard
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }

  function isHomeActive() {
    // Vérifier si la section d'accueil existe et est active
    return homeSection && homeSection.classList.contains('active');
  }

  function resetAnimation() {
    console.log("Réinitialisation de l'animation...");

    // Ne pas réinitialiser si l'animation est complètement détruite
    if (state.isDestroyed) {
      console.log("Animation détruite, réinitialisation impossible");
      return;
    }

    // Réactiver l'animation si elle était désactivée
    state.animationEnabled = true;

    // Arrêter l'animation en cours
    if (state.animationInterval) {
      clearInterval(state.animationInterval);
      state.animationInterval = null;
    }

    // Réinitialiser l'état
    state.index = 0;
    state.toggle = false;
    state.animationStarted = false;
    state.animationStartTime = null;

    // Précharger les images
    preloadImages();

    // Rendre les éléments visibles à nouveau
    if (romyTitle) {
      romyTitle.style.fontFamily = pairs[0].font;
      romyTitle.style.opacity = "1";
      romyTitle.style.visibility = "visible";
      romyTitle.style.zIndex = "1";
      romyTitle.classList.add("appear");
    }

    if (bg1) {
      bg1.style.backgroundImage = `url(${getImagePath(pairs[0].image)})`;
      bg1.style.opacity = "1";
      bg1.style.visibility = "visible";
      bg1.style.zIndex = "-1";
    }

    if (bg2) {
      bg2.style.opacity = "0";
      bg2.style.visibility = "hidden";
      bg2.style.zIndex = "-2";
    }

    console.log("✅ Animation réinitialisée et prête à démarrer.");
  }

  function setupInitialDisplay() {
    if (state.isDestroyed || !state.animationEnabled) return;

    // Première police et image
    if (romyTitle) {
      romyTitle.style.fontFamily = pairs[0].font;
      romyTitle.style.opacity = "1";
      romyTitle.style.visibility = "visible";
      romyTitle.style.zIndex = "1";
      romyTitle.classList.add("appear");
    }

    if (bg1) {
      bg1.style.backgroundImage = `url(${getImagePath(pairs[0].image)})`;
      bg1.style.opacity = "1";
      bg1.style.visibility = "visible";
      bg1.style.zIndex = "-1";
    }

    if (bg2) {
      bg2.style.opacity = "0";
      bg2.style.visibility = "hidden";
      bg2.style.zIndex = "-2";
    }
  }

  function setupSectionObserver() {
    // Observer les changements de classe sur la section d'accueil
    sectionObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // Si la section d'accueil n'est plus active, arrêter l'animation
          if (!isHomeActive()) {
            console.log("Observer: Section d'accueil désactivée");
            stopAnimation();
          } else {
            console.log("Observer: Section d'accueil activée");
            // Ne pas démarrer automatiquement, juste remettre les éléments visibles
            setupInitialDisplay();
          }
        }
      }
    });

    // Appliquer l'observateur à la section d'accueil
    if (homeSection) {
      sectionObserver.observe(homeSection, { attributes: true });
    }
  }

  function setupEventListeners() {
    if (state.isDestroyed || !state.animationEnabled) return;

    // Démarrage au wheel uniquement si on est sur la section d'accueil
    window.addEventListener("wheel", (event) => {
      if (isHomeActive() && !state.animationStarted) {
        startAnimation();
      }

      // Gérer le verrouillage du défilement
      handleScroll(event);
    }, { passive: false });

    // Démarrage au clic sur le titre
    if (romyTitle) {
      romyTitle.addEventListener('click', () => {
        if (isHomeActive()) {
          startAnimation();
        }
      });
    }

    // Support pour le démarrage via un bouton dédié
    const startButton = document.getElementById('startAnimation');
    if (startButton) {
      startButton.addEventListener('click', () => {
        if (isHomeActive()) {
          startAnimation();
        }
      });
    }

    // Écouter les événements de transition pour la compatibilité avec l'architecture modulaire
    document.addEventListener('sectionTransitionComplete', (event) => {
      if (event.detail && event.detail.section) {
        if (event.detail.section.id === config.homeId) {
          // La section d'accueil est active
          console.log("sectionTransitionComplete: Section d'accueil activée");
          setupInitialDisplay();
        } else {
          // Une autre section est active
          console.log("sectionTransitionComplete: Autre section activée");
          stopAnimation();
        }
      }
    });
  }

  function init() {
    console.log("HomeAnimator: Initialisation...");

    // Sélectionner les éléments DOM
    romyTitle = document.querySelector('#romy');
    homeSection = document.querySelector(`#${config.homeId}`);

    // Vérifier si les éléments nécessaires ont été trouvés
    if (!romyTitle) {
      console.error("ERREUR: L'élément #romy n'a pas été trouvé!");
      return false;
    }

    if (!homeSection) {
      console.error("ERREUR: La section d'accueil #home n'a pas été trouvée!");
      return false;
    }

    // Sélectionner ou créer les calques d'arrière-plan
    bg1 = document.querySelector('#bg1') || createBackgroundLayer('bg1');
    bg2 = document.querySelector('#bg2') || createBackgroundLayer('bg2');

    // Réinitialiser l'état
    state.isDestroyed = false;
    state.animationEnabled = true;

    // Préchargement des polices et images
    preloadImages();

    // Configurer l'observateur de section
    setupSectionObserver();

    // Initialiser l'affichage uniquement si la section d'accueil est active
    if (isHomeActive()) {
      setupInitialDisplay();
    }

    // Configurer les gestionnaires d'événements
    setupEventListeners();

    console.log("✅ Animation de la page d'accueil initialisée !");
    return true;
  }

  // API publique
  return {
    init: init,
    startAnimation: startAnimation,
    stopAnimation: stopAnimation,
    resetAnimation: resetAnimation,
    destroyAnimation: destroyAnimation, // Nouvelle méthode publique
    name: "HomeAnimator",
    // Exposer l'état (sans modifier l'original)
    get state() { return { ...state }; },
    // Exposer les paires pour référence
    get pairs() { return [...pairs]; }
  };
})();

// Exporter le module
window.HomeAnimator = HomeAnimator;
