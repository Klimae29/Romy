/**
 * Script pour appliquer un dégradé noir vers gris clair aux sections du site
 */

document.addEventListener('DOMContentLoaded', function() {
  // Créer un élément style
  const styleElement = document.createElement('style');

  // Définir les styles de dégradé noir vers gris clair
  styleElement.textContent = `
    /* Définition des couleurs pour chaque section */
    #home {
      background-color: #000000 !important; /* Noir */
    }

    #allianz {
      background-color: #141414 !important; /* Gris très foncé */
    }

    #carrefour {
      background-color: #282828 !important; /* Gris foncé */
    }

    #craftsmen {
      background-color: #3c3c3c !important; /* Gris charbon */
    }

    #bvlgari {
      background-color: #505050 !important; /* Gris moyen foncé */
    }

    #bordeaux {
      background-color: #646464 !important; /* Gris moyen */
    }

    #happn {
      background-color: #787878 !important; /* Gris moyen clair */
    }

    #defense {
      background-color: #8c8c8c !important; /* Gris clair */
    }

    /* Assurer que les couleurs d'arrière-plan sont prioritaires */
    .section {
      background-color: var(--section-color, inherit);
    }

    /* Pour que le body reflète la couleur de la section active */
    body {
      transition: background-color 1.2s var(--anim-easing);
      will-change: background-color;
    }
  `;

  // Ajouter le style au head du document
  document.head.appendChild(styleElement);

  // Observer les changements de section active
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        const section = mutation.target;
        if (section.classList.contains('active')) {
          // Appliquer la couleur d'arrière-plan de la section active au body
          const sectionColor = getComputedStyle(section).backgroundColor;
          document.body.style.backgroundColor = sectionColor;
          console.log('Couleur appliquée:', sectionColor, 'pour la section', section.id);
        }
      }
    });
  });

  // Observer toutes les sections
  document.querySelectorAll('.section').forEach(function(section) {
    observer.observe(section, { attributes: true });
  });

  console.log('Dégradé noir vers gris clair appliqué avec succès');
});
