console.log("🆗Page chargée avec succès !");

const accueil = document.querySelector(".accueil");
const allianz = document.querySelector("#allianz");
const carrefour = document.querySelector("#carrefour");
const craftsmen = document.querySelector("#craftsmen");
const bvlgari = document.querySelector("#bvlgari");
const bordeaux = document.querySelector("#bordeaux");
const happn = document.querySelector("#happn");
const defense = document.querySelector("#defense");
const ligne1 = document.querySelector(".ligne-1");
const ligne2 = document.querySelector(".ligne-2");
const ligne3 = document.querySelector(".ligne-3");
const ligne4 = document.querySelector(".ligne-4");
const ligne5 = document.querySelector(".ligne-5");
const ligne6 = document.querySelector(".ligne-6");
const ligne7 = document.querySelector(".ligne-7");
const ligne8 = document.querySelector(".ligne-8");
const projetSection = document.querySelectorAll(".project-section");
const ligneContainer = document.querySelector(".ligne-container");

// Fonction pour ne pas afficher le menu sur la page d'accueil
console.log(projetSection, "Super 😁");

// Fonction : montre/masque le menu si une section projet est active
function toggleMenuVisibility() {
  const showMenu = Array.from(projetSection).some(section =>
    section.classList.contains("active")
  );

  ligneContainer.style.opacity = showMenu ? "1" : "0";
  ligneContainer.style.pointerEvents = showMenu ? "auto" : "none";
}

// Fonction pour vérifier l'activation des sections et ajuster les lignes
function updateMenuLines() {
  console.log("🆗Mise à jour des lignes");

  // Mettre à jour l'état des lignes selon les sections actives
  if (allianz.classList.contains("active")) {
    ligne2.classList.add("active");
  } else {
    ligne2.classList.remove("active");
  }

  if (carrefour.classList.contains("active")) {
    ligne3.classList.add("active");
  } else {
    ligne3.classList.remove("active");
  }

  if (craftsmen.classList.contains("active")) {
    ligne4.classList.add("active");
  } else {
    ligne4.classList.remove("active");
  }

  if (bvlgari.classList.contains("active")) {
    ligne5.classList.add("active");
  } else {
    ligne5.classList.remove("active");
  }

  if (bordeaux.classList.contains("active")) {
    ligne6.classList.add("active");
  } else {
    ligne6.classList.remove("active");
  }

  if (happn.classList.contains("active")) {
    ligne7.classList.add("active");
  } else {
    ligne7.classList.remove("active");
  }

  if (defense.classList.contains("active")) {
    ligne8.classList.add("active");
  } else {
    ligne8.classList.remove("active");
  }

  toggleMenuVisibility();
  console.log("Menu doit-il apparaître ?⁉️ ");
}

// Observer les changements de classe sur les sections projet
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (
      mutation.type === "attributes" &&
      mutation.attributeName === "class"
    ) {
      updateMenuLines();
    }
  }
});

// Appliquer l'observateur à chaque section projet
projetSection.forEach(section => {
  observer.observe(section, { attributes: true });
});

// Relancer la fonction à chaque événement de défilement (wheel)
let debounceTimer;
window.addEventListener('wheel', function() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(updateMenuLines, 200); // Attendre 200ms avant de relancer updateMenuLines
});

// FONCTION DE CLICK QUI RAMENE A LA BONNE SECTION
// Lien entre chaque ligne et son ID de section
const sectionMap = {
  "ligne-2": "allianz",
  "ligne-3": "carrefour",
  "ligne-4": "craftsmen",
  "ligne-5": "bvlgari",
  "ligne-6": "bordeaux",
  "ligne-7": "happn",
  "ligne-8": "defense"
};

// Récupère toutes les sections
const sections = document.querySelectorAll(".section");

// Boucle sur chaque entrée du tableau
Object.entries(sectionMap).forEach(([ligneClass, sectionId]) => {
  const ligneElement = document.querySelector(`.${ligneClass}`);
  ligneElement.addEventListener("click", () => {
    // Supprime "active" de toutes les sections
    sections.forEach(section => section.classList.remove("active"));

    // Ajoute "active" uniquement à la section correspondante
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add("active");

    // Met à jour les lignes du menu
    updateMenuLines();
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const accueillink = document.querySelector(".accueil");
  const home = document.querySelector("#home");
  accueillink.addEventListener("click", () => {
    home.classList.add("active");
    allianz.classList.remove("active");
    carrefour.classList.remove("active");
    craftsmen.classList.remove("active");
    bvlgari.classList.remove("active");
    bordeaux.classList.remove("active");
    happn.classList.remove("active");
    defense.classList.remove("active");
  });

  // Retirer l'appel initial de toggleMenuVisibility()
  updateMenuLines();
});
