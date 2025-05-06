/**
 * home-animator.js - Module pour l'animation de la page d'accueil
 * Version adaptée avec bonne structure de fichiers
 */

const HomeAnimator = (function() {
  // Configuration
  const config = {
    animationInterval: 100,  // Intervalle identique à l'original (50ms)
    initialDelay: 0,         // Pas de délai initial comme dans l'original
    scrollLockDuration: 5000  // Nouvelle option: verrouiller le défilement pendant 5 secondes
  };

  // Paires police/image avec les polices de la deuxième version
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
  animationStartTime: null  // Ajoutez cette propriété si elle n'y est pas
};

  // Éléments DOM
  let romyTitle = null;
  let bg1 = null;
  let bg2 = null;

  // Fonction pour obtenir le chemin correct des images
  function getImagePath(imageName) {
    // home_animator.js est dans js/modules/
    // images sont dans assets/images/
    // Il faut donc remonter de deux niveaux avec ../..
    return `../../assets/images/${imageName}`;
  }

  // Fonctions reprises de l'original
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
    pairs.forEach(({ image }) => {
      const img = new Image();
      img.src = getImagePath(image);
      img.onerror = () => {
        console.warn(`Impossible de charger l'image: ${img.src}`);
        // Log des détails pour faciliter le débogage
        console.log(`Tentative avec le chemin: ${img.src}`);
        console.log(`Image relative au HTML: ${image}`);
      };
    });
  }

  function changeBackgroundAndFont() {
    if (!romyTitle) return;

    const current = pairs[state.index];

    // Précharger la police
    preloadFont(current.font);

    // Technique 1: Changement direct avec forceRedraw
    romyTitle.style.fontFamily = current.font;
    forceRedraw(romyTitle);

    // Technique 2: Animation Flash
    romyTitle.classList.add('font-changing');
    setTimeout(() => {
      romyTitle.classList.remove('font-changing');
    }, 100);

    // Technique 3: Changer le contenu temporairement
    const originalText = romyTitle.textContent;
    romyTitle.textContent = originalText + ' ';
    setTimeout(() => {
      romyTitle.textContent = originalText;
    }, 10);

    // Changer l'arrière-plan
    const currentBg = state.toggle ? bg1 : bg2;
    const nextBg = state.toggle ? bg2 : bg1;

    if (nextBg && current.image) {
      const imagePath = getImagePath(current.image);
      nextBg.style.backgroundImage = `url(${imagePath})`;
      nextBg.style.opacity = 1;

      // Log pour débogage
      console.log(`Image chargée: ${imagePath}`);
    }

    if (currentBg) {
      currentBg.style.opacity = 0;
    }

    // Mise à jour pour le prochain changement
    state.toggle = !state.toggle;
    state.index = (state.index + 1) % pairs.length;

    console.log(`Police changée pour: ${current.font}`);
  }

  function startAnimation() {
    if (state.animationStarted) return;

    console.log("Démarrage de l'animation...");

    if (romyTitle) {
      romyTitle.setAttribute('style', 'transition: none !important; will-change: font-family !important;');
    }

    state.animationStarted = true;
    state.animationStartTime = Date.now(); // Ajoutez cette ligne

    // Utiliser un intervalle identique à l'original
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
    console.log("Animation arrêtée.");
  }

  function handleScroll(event) {
    // Si l'animation est en cours et que le temps minimum n'est pas écoulé
    if (state.animationStarted && Date.now() - state.animationStartTime < config.scrollLockDuration) {
      // Empêcher le défilement standard
      event.preventDefault();
      event.stopPropagation(); // Ajouter cette ligne

      // Log pour déboguer
      console.log("Défilement bloqué :", Date.now() - state.animationStartTime, "ms depuis le début");

      return false;
    } else {
      // Log pour déboguer
      console.log("Défilement autorisé :", Date.now() - state.animationStartTime, "ms depuis le début");
    }
  }

  function init() {
    console.log("HomeAnimator: Initialisation...");

    // Sélectionner les éléments DOM
    romyTitle = document.querySelector('#romy');

    // Vérifier si l'élément a été trouvé
    if (!romyTitle) {
      console.error("ERREUR: L'élément #romy n'a pas été trouvé!");
      // Tentative alternative de sélection
      romyTitle = document.querySelector('.home-title');
      console.log("Tentative alternative:", romyTitle);

      if (!romyTitle) {
        console.error("Impossible de trouver le titre ROMY, animation désactivée");
        return false;
      }
    }

    // Sélectionner ou créer les calques d'arrière-plan
    bg1 = document.querySelector('#bg1') || createBackgroundLayer('bg1');
    bg2 = document.querySelector('#bg2') || createBackgroundLayer('bg2');

    // Supprimer les transitions et styles potentiellement conflictuels
    romyTitle.style.transition = "none";
    romyTitle.style.willChange = "font-family";
    romyTitle.setAttribute('style', 'transition: none !important; will-change: font-family !important;');

    // Préchargement des images
    preloadImages();

    // Initialiser l'affichage
    setupInitialDisplay();

    // Configurer les gestionnaires d'événements
    setupEventListeners();

    console.log("✅ Animation de la page d'accueil initialisée !");
    return true;
  }

  function setupInitialDisplay() {
    // Première police et image
    if (romyTitle) {
      romyTitle.style.fontFamily = pairs[0].font;
    }
    if (bg1) {
      bg1.style.backgroundImage = `url(${getImagePath(pairs[0].image)})`;
      bg1.style.opacity = 1;
    }
    if (romyTitle) {
      romyTitle.classList.add("appear");
    }
  }

  function setupEventListeners() {
    // Comportement modifié: démarrage au premier scroll et blocage temporaire
    window.addEventListener("wheel", (event) => {
      if (!state.animationStarted) {
        startAnimation();
      }
      // Empêcher le défilement pendant la durée définie
      handleScroll(event);
    }, { passive: false }); // Important: passive: false permet d'utiliser preventDefault()

    // Démarrage au clic (comme dans l'original)
    if (romyTitle) {
      romyTitle.addEventListener('click', () => {
        startAnimation();
      });
    }

    // Support pour le démarrage via un bouton dédié
    const startButton = document.getElementById('startAnimation');
    if (startButton) {
      startButton.addEventListener('click', () => {
        startAnimation();
      });
    }

    // Écouter les événements de transition pour la compatibilité avec l'architecture modulaire
    document.addEventListener('sectionTransitionComplete', (event) => {
      if (event.detail && event.detail.section && event.detail.section.id !== 'home') {
        stopAnimation();
      }
    });
  }

  // API publique (identique à celle exposée par l'original)
  return {
    init: init,
    startAnimation: startAnimation,
    stopAnimation: stopAnimation,
    // Exposer l'état comme dans l'original
    state: state,
    // Exposer les paires pour référence
    pairs: pairs
  };
})();

// Exporter le module
window.HomeAnimator = HomeAnimator;
