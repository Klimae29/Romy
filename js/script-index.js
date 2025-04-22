console.log("✅ Script index JS chargé !");
document.fonts.ready.then(() => {
  console.log("✅ Toutes les polices Google Fonts sont chargées !");
});

const fonts = [
  "'Anton', sans-serif",
  "'Orbitron', sans-serif",
  "'Amatic SC', cursive",
  "'Comic Sans MS', cursive",
  "'Lucida Console', monospace",
  "'Pacifico', cursive",
  "'Trebuchet MS', sans-serif",
  "'Impact', sans-serif",
  "'Brush Script MT', cursive"
];

const images = [
  "index_univ_1.png",
  "index_univ_2.png",
  "index_univ_3.png",
  "index_univ_4.png",
  "index_univ_5.png",
  "index_univ_6.png",
  "index_univ_7.png",
  "index_univ_8.png",
  "index_univ_9.png"
];

// Préchargement des images
let loadedImages = 0;

const preloadImages = () => {
  images.forEach((src) => {
    const img = new Image();
    img.src = `../assets/images/${src}`;
    img.onload = () => {
      loadedImages++;
      if (loadedImages === images.length) {
        console.log("✅ Toutes les images sont préchargées !");
      }
    };
  });
};

preloadImages();

const romy = document.getElementById("romy");
let index = 0;
let animationStarted = false;

function startFontAnimation() {
  if (animationStarted) return; // empêche de lancer plusieurs fois

  animationStarted = true;



  setInterval(() => {
    romy.style.fontFamily = fonts[index];
    document.body.style.backgroundImage = `url(../assets/images/${images[index]})`;
    index = (index + 1) % fonts.length;
  }, 200); // toutes les 0,1 sec
}

// Déclenche l’animation au premier scroll
window.addEventListener("wheel", function onScroll() {
  startFontAnimation();
  window.removeEventListener("wheel", onScroll); // on l'enlève après le 1er déclenchement
});
