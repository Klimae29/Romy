
console.log("✅ Script index JS chargé !");
document.fonts.ready.then(() => {
  console.log("✅ Toutes les polices Google Fonts sont chargées !");
});



const pairs = [
  { font: "'Comic Sans MS', cursive", image: "index_univ_1.png" },
  { font: "'Amatic SC', cursive", image: "index_univ_2.png" },
  { font: "'Anton', sans-serif", image: "index_univ_3.png" },
  { font: "'Orbitron', sans-serif", image: "index_univ_4.png" },
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
let index = 1; // on commence à 1, car l’index 0 est déjà affiché
let toggle = false;
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

// 🎯 AFFICHER la première image + première police
romy.style.fontFamily = pairs[0].font;
bg1.style.backgroundImage = `url(../assets/images/${pairs[0].image})`;
bg1.style.opacity = 1;
romy.classList.add("appear");

function changeBackgroundAndFont() {
  const current = pairs[index];

  romy.style.fontFamily = current.font;

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

  setInterval(changeBackgroundAndFont, 100);
}

// Lancer l'animation au 1er scroll
window.addEventListener("wheel", function onScroll() {
  startAnimation();
  window.removeEventListener("wheel", onScroll);
});
