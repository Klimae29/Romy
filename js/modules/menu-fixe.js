// Fichier: menu-fixe.js
// Description: Script pour maintenir le menu de navigation visible pendant les transitions

document.addEventListener('DOMContentLoaded', function() {
  console.log("Initialisation du menu fixe...");

  // Références aux éléments du menu
  const ligneContainer = document.querySelector(".ligne-container");
  const logoRomy = document.querySelector(".logoRomy");
  const accueilButton = document.querySelector(".accueil");
  const contactButton = document.querySelector(".contact");

  // Fonction pour afficher le menu (sauf sur la page d'accueil)
  function updateMenuVisibility() {
    const homeSection = document.getElementById('home');
    const isHomeActive = homeSection && homeSection.classList.contains('active');

    // Afficher ou masquer les éléments du menu en fonction de la section active
    if (isHomeActive) {
      // Sur la page d'accueil, masquer le menu
      ligneContainer.style.opacity = "0";
      ligneContainer.style.pointerEvents = "none";
      logoRomy.style.opacity = "0";
      logoRomy.style.pointerEvents = "none";
    } else {
      // Sur toutes les autres pages, afficher le menu
      ligneContainer.style.opacity = "0.6"; // Valeur initiale
      ligneContainer.style.pointerEvents = "auto";
      logoRomy.style.opacity = "0.6"; // Valeur initiale
      logoRomy.style.pointerEvents = "auto";
    }
  }

  // Mettre à jour le menu actif en fonction de la section courante
  function updateActiveMenuItem() {
    const sections = document.querySelectorAll('.section');
    const lignes = document.querySelectorAll('.ligne');

    sections.forEach((section, index) => {
      if (section.classList.contains('active') && index > 0 && index <= lignes.length) {
        // Retirer la classe active de toutes les lignes
        lignes.forEach(ligne => ligne.classList.remove('active'));

        // Ajouter la classe active à la ligne correspondante
        if (index > 0) {
          lignes[index - 1].classList.add('active');
        }
      }
    });
  }

  // Observer les changements des classes sur les sections
  function setupSectionObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateMenuVisibility();
          updateActiveMenuItem();
        }
      });
    });

    // Appliquer l'observateur à toutes les sections
    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section, { attributes: true });
    });
  }

  // Assurer que le menu reste visible pendant les transitions
  function fixMenuDuringTransitions() {
    // Intercepter les événements de transition
    document.addEventListener('sectionTransitionComplete', function(event) {
      updateMenuVisibility();
      updateActiveMenuItem();
    });

    // S'assurer que le menu est à jour lors des clics
    document.addEventListener('click', function() {
      setTimeout(updateMenuVisibility, 100);
      setTimeout(updateActiveMenuItem, 100);
    });

    // S'assurer que le menu est visible pendant le défilement
    window.addEventListener('wheel', function() {
      // Vérifier si on n'est pas sur la page d'accueil
      if (!document.getElementById('home').classList.contains('active')) {
        ligneContainer.style.opacity = "0.6";
        logoRomy.style.opacity = "0.6";
      }
    });
  }

  // Initialisation
  function init() {
    // Configuration initiale du menu
    updateMenuVisibility();
    updateActiveMenuItem();

    // Mise en place des observateurs et écouteurs d'événements
    setupSectionObserver();
    fixMenuDuringTransitions();

    console.log("Menu fixe initialisé avec succès");
  }

  // Lancer l'initialisation
  init();
});
