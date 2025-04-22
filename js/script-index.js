console.log("✅ Script index JS chargé !");

const fonts = [
  "Arial, sans-serif",
  "'Courier New', monospace",
  "'Georgia', serif",
  "'Comic Sans MS', cursive",
  "'Lucida Console', monospace",
  "'Times New Roman', serif",
  "'Trebuchet MS', sans-serif",
  "'Impact', sans-serif",
  "'Brush Script MT', cursive"
];

const romy = document.getElementById("romy");
let index = 0;
let animationStarted = false;

function startFontAnimation() {
  if (animationStarted) return; // empêche de lancer plusieurs fois

  animationStarted = true;

  setInterval(() => {
    romy.style.fontFamily = fonts[index];
    index = (index + 1) % fonts.length;
  }, 100); // toutes les 0,1 sec
}

// Déclenche l’animation au premier scroll
window.addEventListener("wheel", function onScroll() {
  startFontAnimation();
  window.removeEventListener("wheel", onScroll); // on l'enlève après le 1er déclenchement
});
