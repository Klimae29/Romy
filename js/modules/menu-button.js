/**
 * menu-button.js - Gestion des interactions avec les menus de navigation
 * Version refactorisée pour utiliser SectionNavigator et arrêter correctement les animations
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log("🆗 Initialisation du menu...");

  // Références aux éléments principaux
  const accueil = document.querySelector(".accueil");
  const contact = document.querySelector(".contact"); // Ajout de la référence à contact
  const projetSections = document.querySelectorAll(".project-section");
  const ligneContainer = document.querySelector(".ligne-container");
  const logoRomy = document.querySelector(".logoRomy");
  const sections = document.querySelectorAll(".section");

  // Mapping des lignes vers les sections
  const sectionMap = {
    "ligne-2": "allianz",
    "ligne-3": "carrefour",
    "ligne-4": "craftsmen",
    "ligne-5": "bvlgari",
    "ligne-6": "bordeaux",
    "ligne-7": "happn",
    "ligne-8": "defense"
  };

  /**
   * Fonction pour afficher/masquer le menu selon la section active
   */
  function toggleMenuVisibility() {
    console.log("🔄 Mise à jour de la visibilité du menu");

    // Vérifier si une section de projet est active
    const showMenu = Array.from(projetSections).some(section =>
      section.classList.contains("active")
    );

    // Afficher/masquer les éléments de navigation
    ligneContainer.style.opacity = showMenu ? "0.6" : "0";
    ligneContainer.style.pointerEvents = showMenu ? "auto" : "none";
    logoRomy.style.opacity = showMenu ? "0.6" : "0";
    logoRomy.style.pointerEvents = showMenu ? "auto" : "none";
  }

  /**
   * Mise à jour de l'état des lignes du menu selon la section active
   */
  function updateMenuLines() {
    console.log("🔄 Mise à jour des indicateurs de menu");

    // Parcourir toutes les correspondances sections/lignes
    Object.entries(sectionMap).forEach(([lineClass, sectionId]) => {
      const lineElement = document.querySelector(`.${lineClass}`);
      const sectionElement = document.getElementById(sectionId);

      if (lineElement && sectionElement) {
        // Mettre à jour la classe active si nécessaire
        if (sectionElement.classList.contains("active")) {
          lineElement.classList.add("active");
        } else {
          lineElement.classList.remove("active");
        }
      }
    });

    // Mettre à jour la visibilité globale du menu
    toggleMenuVisibility();
  }

  /**
   * Configuration des gestionnaires d'événements pour les lignes du menu
   */
  function setupLineNavigation() {
    // Configurer chaque ligne du menu
    Object.entries(sectionMap).forEach(([lineClass, sectionId]) => {
      const lineElement = document.querySelector(`.${lineClass}`);

      if (lineElement) {
        lineElement.addEventListener("click", (event) => {
          event.preventDefault();

          console.log(`🖱️ Clic sur la ligne ${lineClass} vers la section ${sectionId}`);

          // Utiliser SectionNavigator si disponible
          if (window.SectionNavigator && typeof window.SectionNavigator.navigateTo === 'function') {
            window.SectionNavigator.navigateTo(sectionId);
          } else {
            console.warn("⚠️ SectionNavigator non disponible, fallback à la méthode manuelle");

            // Fallback: méthode manuelle
            sections.forEach(section => section.classList.remove("active"));
            const targetSection = document.getElementById(sectionId);
            if (targetSection) targetSection.classList.add("active");

            // Arrêter l'animation si on quitte la page d'accueil
            if (window.HomeAnimator && window.HomeAnimator.stopAnimation) {
              window.HomeAnimator.stopAnimation();
            }

            // Mise à jour des indicateurs
            updateMenuLines();
          }
        });
      }
    });
  }

  /**
   * Configuration du lien "Accueil"
   */
  function setupHomeLink() {
    if (accueil) {
      accueil.addEventListener("click", (event) => {
        event.preventDefault();

        console.log("🏠 Navigation vers l'accueil");

        // Utiliser SectionNavigator si disponible
        if (window.SectionNavigator && typeof window.SectionNavigator.navigateTo === 'function') {
          window.SectionNavigator.navigateTo("home");
        } else {
          console.warn("⚠️ SectionNavigator non disponible, fallback à la méthode manuelle");

          // Fallback: méthode manuelle
          sections.forEach(section => section.classList.remove("active"));
          const homeSection = document.getElementById("home");
          if (homeSection) homeSection.classList.add("active");

          // Réinitialiser l'animation après un court délai
          setTimeout(() => {
            if (window.HomeAnimator && window.HomeAnimator.resetAnimation) {
              window.HomeAnimator.resetAnimation();
            }
          }, 100);

          // Mise à jour des indicateurs
          updateMenuLines();
        }
      });
    }
  }

  /**
 * Configuration du lien "Contact"
 */
  function setupContactLink() {
    if (contact) {
      contact.addEventListener("click", (event) => {
        event.preventDefault();

        console.log("📧 Navigation vers contact");

        // Utiliser SectionNavigator si disponible
        if (window.SectionNavigator && typeof window.SectionNavigator.navigateTo === 'function') {
          window.SectionNavigator.navigateTo("contact");
        } else {
          console.warn("⚠️ SectionNavigator non disponible, fallback à la méthode manuelle");

          // Fallback: méthode manuelle
          sections.forEach(section => section.classList.remove("active"));
          const contactSection = document.getElementById("contact");
          if (contactSection) contactSection.classList.add("active");

          // Mise à jour des indicateurs
          updateMenuLines();
        }
      });
    }
  }

  /**
   * Configurer l'observateur pour détecter les changements de section
   */
  function setupSectionObserver() {
    // Observer les changements de classe sur les sections
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          updateMenuLines();
        }
      }
    });

    // Appliquer l'observateur à toutes les sections
    sections.forEach(section => {
      observer.observe(section, { attributes: true });
    });
  }

  /**
   * Configurer la détection du défilement pour mettre à jour le menu
   */
  function setupScrollDetection() {
    let debounceTimer;
    window.addEventListener('wheel', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateMenuLines, 200);
    });
  }

  /**
   * Répondre aux événements de transition entre sections
   */
  function setupTransitionListener() {
    document.addEventListener('sectionTransitionComplete', function(event) {
      if (event.detail && event.detail.section) {
        console.log(`🔄 Transition complétée vers la section: ${event.detail.section.id}`);
        updateMenuLines();
      }
    });
  }


  // Initialisation
  function initialize() {
    setupLineNavigation();
    setupHomeLink();
    setupContactLink(); // Ajout de l'initialisation du lien Contact
    setupSectionObserver();
    setupScrollDetection();
    setupTransitionListener();
    updateMenuLines(); // État initial

    console.log("✅ Menu et navigation initialisés avec succès");
  }

  // Démarrer l'initialisation
  initialize();
});
