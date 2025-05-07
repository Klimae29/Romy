document.getElementById("btncontact").addEventListener("click", (e) => {
  e.preventDefault(); // évite le comportement par défaut du lien

  // Crée un lien temporaire pour forcer l'ouverture de l'application mail
  const mailtoLink = document.createElement("a");
  mailtoLink.href = "mailto:test@example.com?subject=Contact&body=Bonjour";
  mailtoLink.style.display = "none";
  document.body.appendChild(mailtoLink);
  mailtoLink.click();
  document.body.removeChild(mailtoLink);

  // Fallback : afficher le formulaire au bout de 4 secondes
  setTimeout(() => {
    const form = document.getElementById("contactForm");
    form.style.display = "block";
    alert("Si votre application mail ne s'est pas ouverte, vous pouvez nous contacter via ce formulaire.");
  }, 4000);
});
