/**
 * home-animator.js - Module pour l'animation de la page d'accueil
 * Ce module gère les animations de titre et d'arrière-plan de la page d'accueil
 */

const HomeAnimator = (function() {
  // Configuration
  const config = {
    animationInterval: 2000,  // Intervalle entre les changements (ms)
    initialDelay: 1000        // Délai avant le premier changement (ms)
  };

  // Paires police/image
  const pairs = [
    { font: "'Playfair Display', serif", image: "assets/images/index_univ_1.png" },
    { font: "'Amatic SC', cursive", image: "assets/images/index_univ_2.png" },
    { font: "'Anton', sans-serif", image: "assets/images/index_univ_3.png" },
    { font: "'Orbitron', sans-serif", image: "assets/images/index_univ_4.png" },
    { font: "'Lucida Console', monospace", image: "assets/images/index_univ_5.png" },
    { font: "'Pacifico', cursive", image: "assets/images/index_univ_6.png" },
    { font: "'Trebuchet MS', sans-serif", image: "assets/images/index_univ_7.png" },
    { font: "'Impact', sans-serif", image: "assets/images/index_univ_8.png" },
    { font: "'Poppins', sans-serif", image: "assets/images/index_univ_9.png" }
  ];

  // État
  let state = {
    index: 0,
    toggle: false,
    animationStarted: false,
    animationInterval: null
  };

  // Éléments DOM
  let romyTitle = null;
  let bg1 = null;
  let bg2 = null;

  // Technique de force-redraw pour s'assurer que le changement de police est visible
  function forceRedraw(element) {
    if (!element) return;
    // Ces opérations forcent le navigateur à redessiner l'élément
    const display = element.style.display;
    element.style.display = 'none';
    void element.offsetHeight; // Force un reflow
    element.style.display = display;
  }

  // Créer un calque d'arrière-plan si nécessaire
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

  // Précharger les polices pour éviter les sauts lors des changements
  function preloadFont(fontFamily, text) {
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
  }

  // Précharger les images
  function preloadImages() {
    pairs.forEach(({ image }) => {
      const img = new Image();
      img.src = image;
      // Ajouter un gestionnaire d'erreur pour détecter les images manquantes
      img.onerror = () => {
        console.warn(`Impossible de charger l'image: ${image}`);
      };
    });
  }

  // Changer la police et l'arrière-plan
  function changeBackgroundAndFont() {
    if (!romyTitle) return;

    const current = pairs[state.index];

    // Précharger la police
    preloadFont(current.font);

    // Changer la police avec forceRedraw
    romyTitle.style.fontFamily = current.font;
    forceRedraw(romyTitle);

    // Animation Flash pour rendre le changement plus visible
    romyTitle.classList.add('font-changing');
    setTimeout(() => {
      romyTitle.classList.remove('font-changing');
    }, 50);

    // Technique supplémentaire pour forcer un redraw
    const originalText = romyTitle.textContent;
    romyTitle.textContent = originalText + ' ';
    setTimeout(() => {
      romyTitle.textContent = originalText;
    }, 10);

    // Changer l'arrière-plan
    const currentBg = state.toggle ? bg1 : bg2;
    const nextBg = state.toggle ? bg2 : bg1;

    if (nextBg && current.image) {
      nextBg.style.backgroundImage = `url(${current.image})`;
      nextBg.style.opacity = 1;
    }

    if (currentBg) {
      currentBg.style.opacity = 0;
    }

    // Mise à jour pour le prochain changement
    state.toggle = !state.toggle;
    state.index = (state.index + 1) % pairs.length;

    console.log(`Police changée pour: ${current.font}`);
  }

  // Démarrer l'animation
  function startAnimation() {
    if (state.animationStarted) return;

    console.log("Démarrage de l'animation d'accueil...");

    // Forcer la suppression de tout attribut qui pourrait interférer
    if (romyTitle) {
      romyTitle.setAttribute('style', 'transition: none !important; will-change: font-family !important;');
    }

    state.animationStarted = true;

    // Premier changement après un délai initial
    setTimeout(() => {
      changeBackgroundAndFont();

      // Puis démarrer l'intervalle régulier
      state.animationInterval = setInterval(() => {
        changeBackgroundAndFont();
      }, config.animationInterval);
    }, config.initialDelay);

    console.log("✅ Animation de la page d'accueil démarrée !");
  }

  // Arrêter l'animation
  function stopAnimation() {
    if (!state.animationStarted) return;

    if (state.animationInterval) {
      clearInterval(state.animationInterval);
      state.animationInterval = null;
    }

    state.animationStarted = false;
    console.log("Animation d'accueil arrêtée.");
  }

  // Initialisation
  function init() {
    // Sélectionner les éléments DOM
    romyTitle = document.querySelector('#romy');
    bg1 = document.querySelector('#bg1') || createBackgroundLayer('bg1');
    bg2 = document.querySelector('#bg2') || createBackgroundLayer('bg2');

    if (!romyTitle) {
      console.error("ERREUR: L'élément #romy n'a pas été trouvé!");
      return;
    }

    // Supprimer les transitions et styles potentiellement conflictuels
    romyTitle.style.transition = "none";
    romyTitle.style.willChange = "font-family";

    // Préchargement des images
    preloadImages();

    // Initialiser l'affichage
    if (bg1) {
      bg1.style.backgroundImage = `url(${pairs[0].image})`;
      bg1.style.opacity = 1;
    }

    // Ajouter la classe appear pour l'animation initiale
    romyTitle.classList.add("appear");

    // Configurer les gestionnaires d'événements
    setupEventListeners();

    console.log("✅ Animation de la page d'accueil initialisée !");
  }

  // Configurer les gestionnaires d'événements
  function setupEventListeners() {
    // Démarrer l'animation au premier scroll
    window.addEventListener("wheel", () => {
      // Vérifier qu'on est sur la section d'accueil
      const homeSection = document.querySelector('.section.active#home');
      if (homeSection) {
        startAnimation();
      }
    }, { once: false });

    // Également démarrer l'animation sur click pour mobile
    if (romyTitle) {
      romyTitle.addEventListener('click', () => {
        startAnimation();
      });
    }

    // Démarrer l'animation sur touch pour mobile
    window.addEventListener("touchstart", () => {
      const homeSection = document.querySelector('.section.active#home');
      if (homeSection && !state.animationStarted) {
        startAnimation();
      }
    }, { once: true });

    // Event listener pour la sélection de section (pour arrêter l'animation quand on quitte home)
    document.addEventListener('sectionTransitionComplete', (event) => {
      const section = event.detail.section;
      if (section && section.id !== 'home') {
        stopAnimation();
      }
    });
  }

  // API publique
  return {
    init: init,
    startAnimation: startAnimation,
    stopAnimation: stopAnimation,
    get state() { return { ...state }; }  // Exposer une copie de l'état
  };
})();

// Exporter le module
window.HomeAnimator = HomeAnimator;
