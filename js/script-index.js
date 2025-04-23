console.log("✅ Script index JS chargé !");
document.fonts.ready.then(() => {
  console.log("✅ Toutes les polices Google Fonts sont chargées !");
});

const pairs = [
  { font: "'Anton', sans-serif", image: "index_univ_1.png" },
  { font: "'Orbitron', sans-serif", image: "index_univ_2.png" },
  { font: "'Amatic SC', cursive", image: "index_univ_3.png" },
  { font: "'Comic Sans MS', cursive", image: "index_univ_4.png" },
  { font: "'Lucida Console', monospace", image: "index_univ_5.png" },
  { font: "'Pacifico', cursive", image: "index_univ_6.png" },
  { font: "'Trebuchet MS', sans-serif", image: "index_univ_7.png" },
  { font: "'Impact', sans-serif", image: "index_univ_8.png" },
  { font: "'Brush Script MT', cursive", image: "index_univ_9.png" }
];

// Préchargement des images
pairs.forEach(({ image }) => {
  const img = new Image();
  img.src = `../assets/images/${image}`;
});

const romy = document.getElementById("romy");
let index = 0;
let toggle = true;
let animationStarted = false;

// Création des 2 calques background
const bg1 = document.createElement("div");
const bg2 = document.createElement("div");

[bg1, bg2].forEach(bg => {
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
});

bg1.style.opacity = 1; // Pour afficher la première image au départ

function changeBackgroundAndFont() {
  const current = pairs[index];

  // Change la police
  romy.style.fontFamily = current.font;

  // Change l'image de fond
  const currentBg = toggle ? bg1 : bg2;
  const nextBg = toggle ? bg2 : bg1;

  nextBg.style.backgroundImage = `url(../assets/images/${current.image})`;
  nextBg.style.opacity = 1;
  currentBg.style.opacity = 0;

  toggle = !toggle;
  index = (index + 1) % pairs.length;
}

function startAnimation() {
  if (animationStarted) return;
  animationStarted = true;

  changeBackgroundAndFont(); // Premier changement immédiat
  setInterval(changeBackgroundAndFont, 200);
}

// Déclenchement au 1er scroll
window.addEventListener("wheel", function onScroll() {
  startAnimation();
  window.removeEventListener("wheel", onScroll);
});
