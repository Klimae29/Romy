document.addEventListener('DOMContentLoaded', function() {
  // Fonction pour mettre à jour les liens du menu
  function updateMenuLinks() {
    const contactSection = document.getElementById('contact');
    const homeSection = document.getElementById('home');
    const contactLink = document.querySelector('.contact');
    const accueilLink = document.querySelector('.accueil');

    // Mettre à jour les liens en conséquence
    if (contactSection && contactSection.classList.contains('active')) {
      contactLink.classList.add('active');
    } else if (contactLink) {
      contactLink.classList.remove('active');
    }

    if (homeSection && homeSection.classList.contains('active')) {
      accueilLink.classList.add('active');
    } else if (accueilLink) {
      accueilLink.classList.remove('active');
    }
  }

  // Observer les changements de sections actives
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        updateMenuLinks();
      }
    });
  });

  // Observer toutes les sections
  document.querySelectorAll('.section').forEach(function(section) {
    observer.observe(section, { attributes: true });
  });

  // Exécuter une première fois au chargement
  updateMenuLinks();
});
