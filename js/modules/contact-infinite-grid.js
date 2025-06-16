/**
 * Contact Infinite Grid Module
 * Grille infinie parallax en premier plan pour la section contact
 * Inspiré du tutoriel Codrops
 */

class ContactInfiniteGrid {
  constructor(options = {}) {
    this.el = options.el || document.querySelector('#contact-grid');
    this.sources = options.sources || [];
    this.data = options.data || [];
    this.originalSize = options.originalSize || {w: 1522, h: 1238};

    this.winW = window.innerWidth;
    this.winH = window.innerHeight;
    this.items = [];
    this.scroll = {
      current: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      last: { x: 0, y: 0 },
      ease: 0.1
    };
    this.mouse = {
      x: { c: 0.5, t: 0.5 },
      y: { c: 0.5, t: 0.5 },
      press: { t: 0, c: 0 }
    };
    this.drag = {
      startX: 0,
      startY: 0,
      scrollX: 0,
      scrollY: 0
    };
    this.isDragging = false;
    this.tileSize = { w: 0, h: 0 };

    // Observer pour les animations de visibilité
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
      });
    });

    this.init();
  }

  init() {
    if (!this.el) {
      console.warn('Element #contact-grid non trouvé');
      return;
    }

    // Vérifier si GSAP est disponible
    if (typeof gsap === 'undefined') {
      console.warn('GSAP non disponible. Animation d\'intro désactivée.');
    }

    this.setupScrollControl();
    this.bindEvents();
    this.resize();
    this.render();

    // Animation d'intro avec délai
    setTimeout(() => {
      this.initIntro();
      this.intro();
    }, 500);
  }

  setupScrollControl() {
  // Observer pour détecter quand on entre/sort de la section contact
  this.sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Entrer dans la section contact - bloquer le scroll général
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        this.isInContactSection = true;
      } else {
        // Sortir de la section contact - restaurer le scroll général
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        this.isInContactSection = false;
      }
    });
  }, {
    threshold: 0.5 // Se déclenche quand 50% de la section est visible
  });

  // Observer la section contact
  const contactSection = document.querySelector('#contact');
  if (contactSection) {
    this.sectionObserver.observe(contactSection);
  }
}

  bindEvents() {
    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });

    // Touch events pour mobile
    window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    window.addEventListener('touchend', this.onTouchEnd.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
  }

  onWheel(e) {
    if (!this.isInContactSection) return;

    e.preventDefault();
    const factor = 0.4;
    this.scroll.target.x -= e.deltaX * factor;
    this.scroll.target.y -= e.deltaY * factor;
  }

  onMouseDown(e) {
    e.preventDefault();
    this.isDragging = true;
    document.documentElement.classList.add('dragging');
    this.mouse.press.t = 1;
    this.drag.startX = e.clientX;
    this.drag.startY = e.clientY;
    this.drag.scrollX = this.scroll.target.x;
    this.drag.scrollY = this.scroll.target.y;
  }

  onMouseUp() {
    this.isDragging = false;
    document.documentElement.classList.remove('dragging');
    this.mouse.press.t = 0;
  }

  onMouseMove(e) {
    this.mouse.x.t = e.clientX / this.winW;
    this.mouse.y.t = e.clientY / this.winH;

    if (this.isDragging) {
      const dx = e.clientX - this.drag.startX;
      const dy = e.clientY - this.drag.startY;
      this.scroll.target.x = this.drag.scrollX + dx;
      this.scroll.target.y = this.drag.scrollY + dy;
    }
  }

  onTouchStart(e) {
    const touch = e.touches[0];
    this.isDragging = true;
    this.drag.startX = touch.clientX;
    this.drag.startY = touch.clientY;
    this.drag.scrollX = this.scroll.target.x;
    this.drag.scrollY = this.scroll.target.y;
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  onTouchMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const dx = touch.clientX - this.drag.startX;
    const dy = touch.clientY - this.drag.startY;
    this.scroll.target.x = this.drag.scrollX + dx;
    this.scroll.target.y = this.drag.scrollY + dy;
  }

  resize() {
    this.winW = window.innerWidth;
    this.winH = window.innerHeight;

    // Calculer la taille des tuiles
    this.tileSize = {
      w: this.winW,
      h: this.winW * (this.originalSize.h / this.originalSize.w)
    };

    // Reset scroll
    this.scroll.current = { x: 0, y: 0 };
    this.scroll.target = { x: 0, y: 0 };
    this.scroll.last = { x: 0, y: 0 };

    // Vider le conteneur
    this.el.innerHTML = '';

    // Mettre à l'échelle les éléments de base
    const baseItems = this.data.map((d, i) => {
      const scaleX = this.tileSize.w / this.originalSize.w;
      const scaleY = this.tileSize.h / this.originalSize.h;
      const source = this.sources[i % this.sources.length];

      return {
        src: source.src,
        caption: source.caption,
        x: d.x * scaleX,
        y: d.y * scaleY,
        w: d.w * scaleX,
        h: d.h * scaleY
      };
    });

    this.items = [];

    // Répétitions pour la grille infinie (2x2)
    const repsX = [0, this.tileSize.w];
    const repsY = [0, this.tileSize.h];

    baseItems.forEach((base) => {
      repsX.forEach((offsetX) => {
        repsY.forEach((offsetY) => {
          // Créer la structure DOM
          const el = document.createElement('div');
          el.classList.add('grid-item');
          el.style.width = `${base.w}px`;

          const wrapper = document.createElement('div');
          wrapper.classList.add('item-wrapper');
          el.appendChild(wrapper);

          const itemImage = document.createElement('div');
          itemImage.classList.add('item-image');
          itemImage.style.width = `${base.w}px`;
          itemImage.style.height = `${base.h}px`;
          wrapper.appendChild(itemImage);

          const img = new Image();
          // ✅ LIGNE CORRIGÉE - Chemin sans "./"
          img.src = `assets/images/cinema/${base.src}`;
          itemImage.appendChild(img);

          const caption = document.createElement('small');
          caption.innerHTML = base.caption;

          // SplitText pour animation ligne par ligne (optionnel)
          if (typeof SplitText !== 'undefined') {
            try {
              const split = new SplitText(caption, {
                type: 'lines',
                mask: 'lines',
                linesClass: 'line'
              });

              split.lines.forEach((line, i) => {
                line.style.transitionDelay = `${i * 0.15}s`;
                line.parentElement.style.transitionDelay = `${i * 0.15}s`;
              });
            } catch (error) {
              console.warn('SplitText non disponible:', error);
            }
          }

          wrapper.appendChild(caption);
          this.el.appendChild(el);

          // Observer pour les animations de visibilité
          this.observer.observe(caption);

          // Stocker les métadonnées
          this.items.push({
            el,
            container: itemImage,
            wrapper,
            img,
            x: base.x + offsetX,
            y: base.y + offsetY,
            w: base.w,
            h: base.h,
            extraX: 0,
            extraY: 0,
            rect: el.getBoundingClientRect(),
            ease: Math.random() * 0.5 + 0.5
          });
        });
      });
    });

    // Doubler la zone de tuile pour la duplication 2x2
    this.tileSize.w *= 2;
    this.tileSize.h *= 2;

    // Position de scroll initiale légèrement décentrée
    this.scroll.current.x = this.scroll.target.x = this.scroll.last.x = -this.winW * 0.1;
    this.scroll.current.y = this.scroll.target.y = this.scroll.last.y = -this.winH * 0.1;
  }

  render() {
    // Interpolation fluide
    this.scroll.current.x += (this.scroll.target.x - this.scroll.current.x) * this.scroll.ease;
    this.scroll.current.y += (this.scroll.target.y - this.scroll.current.y) * this.scroll.ease;

    // Interpolation souris
    this.mouse.x.c += (this.mouse.x.t - this.mouse.x.c) * 0.1;
    this.mouse.y.c += (this.mouse.y.t - this.mouse.y.c) * 0.1;
    this.mouse.press.c += (this.mouse.press.t - this.mouse.press.c) * 0.1;

    // Calculer les deltas pour parallax
    const dx = this.scroll.current.x - this.scroll.last.x;
    const dy = this.scroll.current.y - this.scroll.last.y;

    // Mettre à jour chaque élément
    this.items.forEach(item => {
      const parX = 5 * dx * item.ease + (this.mouse.x.c - 0.5) * item.rect.width * 0.6;
      const parY = 5 * dy * item.ease + (this.mouse.y.c - 0.5) * item.rect.height * 0.6;

      // Wrapping infini
      const posX = item.x + this.scroll.current.x + item.extraX + parX;
      if (posX > this.winW) item.extraX -= this.tileSize.w;
      if (posX + item.rect.width < 0) item.extraX += this.tileSize.w;

      const posY = item.y + this.scroll.current.y + item.extraY + parY;
      if (posY > this.winH) item.extraY -= this.tileSize.h;
      if (posY + item.rect.height < 0) item.extraY += this.tileSize.h;

      // Appliquer la transformation
      item.el.style.transform = `translate(${posX}px, ${posY}px)`;

      // Parallax des images
      const imgParX = -parX * 0.3;
      const imgParY = -parY * 0.3;
      item.img.style.transform = `translate(${imgParX}px, ${imgParY}px) scale(1.1)`;
    });

    this.scroll.last.x = this.scroll.current.x;
    this.scroll.last.y = this.scroll.current.y;

    requestAnimationFrame(this.render.bind(this));
  }

  initIntro() {
    if (typeof gsap === 'undefined') return;

    this.introItems = [...this.el.querySelectorAll('.item-wrapper')].filter((item) => {
      const rect = item.getBoundingClientRect();
      return (
        rect.x > -rect.width &&
        rect.x < window.innerWidth + rect.width &&
        rect.y > -rect.height &&
        rect.y < window.innerHeight + rect.height
      );
    });

    this.introItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const x = -rect.x + window.innerWidth * 0.5 - rect.width * 0.5;
      const y = -rect.y + window.innerHeight * 0.5 - rect.height * 0.5;
      gsap.set(item, { x, y });
    });
  }

  intro() {
    if (typeof gsap === 'undefined') return;

    gsap.to(this.introItems.reverse(), {
      duration: 2,
      ease: 'expo.inOut',
      x: 0,
      y: 0,
      stagger: 0.05
    });
  }
}

// Données par défaut pour la section contact
const defaultContactData = {
  sources: [
    {src: 'cadreur.jpeg', caption: 'Direction artistique <br>Création d\'univers visuels <br>Storytelling cinématographique <br>2024'},
    {src: 'decorateur.jpg', caption: 'Production audiovisuelle <br>Courts et longs métrages <br>Documentaires créatifs <br>2023'},
    {src: 'grip.jpeg', caption: 'Post-production <br>Montage et étalonnage <br>Design sonore <br>2024'},
    {src: 'moniteur.jpeg', caption: 'Direction photo <br>Éclairage créatif <br>Composition d\'image <br>2022'},
    {src: 'lens-1.jpg', caption: 'Réalisation <br>Direction d\'acteurs <br>Mise en scène <br>2024'},
    {src: 'set-1.jpg', caption: 'Création publicitaire <br>Films institutionnels <br>Contenus digitaux <br>2023'}
  ],
  data: [
    {x: 71, y: 58, w: 400, h: 270},
    {x: 211, y: 255, w: 540, h: 360},
    {x: 631, y: 158, w: 400, h: 270},
    {x: 1191, y: 245, w: 260, h: 195},
    {x: 351, y: 687, w: 260, h: 290},
    {x: 751, y: 824, w: 205, h: 154}
  ],
  originalSize: {w: 1522, h: 1238}
};

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
  const contactGridEl = document.querySelector('#contact-grid');
  if (contactGridEl) {
    window.contactInfiniteGrid = new ContactInfiniteGrid({
      el: contactGridEl,
      sources: defaultContactData.sources,
      data: defaultContactData.data,
      originalSize: defaultContactData.originalSize
    });
  }
});

// Export pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContactInfiniteGrid;
}
