/**
 * Script pour appliquer un dégradé vert-bleu-orange aux sections du site
 */

document.addEventListener('DOMContentLoaded', function() {
  // Créer un élément style
  const styleElement = document.createElement('style');

  // Définir les styles de dégradé vert-bleu-orange
  styleElement.textContent = `
    /* CSS pour créer un effet de dégradé du vert profond à l'orange entre les sections */
    .section.project-section {
      /* Crée un dégradé linéaire du haut vers le bas */
      background: linear-gradient(to bottom, var(--section-color), var(--next-section-color)) !important;
      transition: background 0.5s ease;
    }

    /* Définition des couleurs pour chaque section dans la progression vert → bleu → orange */
    #home {
      --section-color: #0a3c20;       /* Vert forêt foncé pour commencer */
      --next-section-color: #0d4e2c;  /* Vert forêt */
    }

    #allianz {
      --section-color: #0d4e2c;       /* Vert forêt */
      --next-section-color: #10604a;  /* Vert profond turquoise */
    }

    #carrefour {
      --section-color: #10604a;       /* Vert profond turquoise */
      --next-section-color: #126884;  /* Bleu-vert (transition) */
    }

    #craftsmen {
      --section-color: #126884;       /* Bleu-vert */
      --next-section-color: #1469b1;  /* Bleu */
    }

    #bvlgari {
      --section-color: #1469b1;       /* Bleu */
      --next-section-color: #4357a5;  /* Bleu-violet */
    }

    #bordeaux {
      --section-color: #4357a5;       /* Bleu-violet */
      --next-section-color: #75467d;  /* Violet */
    }

    #happn {
      --section-color: #75467d;       /* Violet */
      --next-section-color: #a84658;  /* Rouge-rose */
    }

    #defense {
      --section-color: #a84658;       /* Rouge-rose */
      --next-section-color: #e06b2d;  /* Orange vif pour terminer */
    }

    /* Pour assurer que le gradient couvre toute la section */
    .project-container {
      background: transparent;
    }
  `;

  // Ajouter le style au head du document
  document.head.appendChild(styleElement);

  console.log('Dégradé vert-bleu-orange appliqué avec succès');
});
