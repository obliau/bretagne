    const playground = document.body;
    const movables = [];
    const kreisNamen = [
      "alge",
      "auster",
      "felsgarnele",
      "hummer",
      "kompassqualle",
      "napfschnecke",
      "oktopus",
      "rochen",
      "schlangenseestern",
      "seeanemone",
      "seeigel",
      "seepocken",
      "fisch"
    ];
  
    const combinations = {
      "alge-napfschnecke": "projekte/briefe.html",
      "felsgarnele-seepocken": "projekte/egor.html",
      "kompassqualle-rochen": "projekte/entre-sentieure.html",
      "hummer-schlangenseestern": "projekte/HumanNature.html",
      "oktopus-seeanemone": "projekte/IchUndWir.html",
      "napfschnecke-seeigel": "projekte/mareesImprimees.html",
      "hummer-rochen": "projekte/menhirküre.html",
      "felsgarnele-oktopus": "projekte/stayhere.html",
      "kompassqualle-seeanemone": "projekte/TheInBetween.html",
      "alge-seeanemone": "projekte/thelake.html",
      "schlangenseestern-seepocken": "projekte/tiefblau.html",
      "auster-napfschnecke": "projekte/UebergaengeInMusik.html",
      "fisch-seeigel": "projekte/zwischentoene.html",
      "info": "projekte/info.html",

  };

  //Navbar
    function toggleMenu() {
    const menu = document.getElementById("fullscreenMenu");
    menu.classList.toggle("hidden");
    }

    const attractor = {
      x: window.innerWidth / 2,
      y: window.innerHeight - 70,
      radius: 150,
      strength: 0.05
    };

    for (let i = 0; i < kreisNamen.length; i++) {
      const id = kreisNamen[i];
      const img = document.createElement('img');
      document.getElementById('navigation').appendChild(img)
      img.dataset.id = id;
      img.src = `images/meerestiere/${id}.png`;
      img.classList.add('movable');
      img.style.position = 'absolute';

      const fixedSize = 80;
      img.style.width = `${fixedSize}px`;
      img.style.height = `${fixedSize}px`;

      img.style.cursor = 'grab';

      const maxTop = window.innerHeight - fixedSize;
      const maxLeft = window.innerWidth - fixedSize;
      let top, left;

      let isInsideAttractor = true;
      let attempts = 0;
      const maxAttempts = 100;
    
    function checkCombination() {
  const inZone = movables.filter(el => el.classList.contains("in-zone"));

  if (inZone.length == 2) {
    const ids = inZone.map(el => el.dataset.id).sort();
    const key = `${ids[0]}-${ids[1]}`;
    const key2 = `${ids[1]}-${ids[0]}`;
    console.log(key)
    console.log(combinations[key])

    if (combinations[key] || combinations[key2]) {
      setTimeout(() => {
        document.getElementsByClassName("combo-zone")[0].style.backgroundImage="url('Comp-2_2.gif')";
      }, "500");
      setTimeout(() => {
        openContent(combinations[key])
      }, "1500");
      setTimeout(() => {
        document.getElementsByClassName("combo-zone")[0].style.backgroundImage="url('netz.png')";
      }, "2000");
    } 
  }
}

do {
  top = Math.random() * maxTop;
  left = Math.random() * maxLeft;

  const centerX = left + fixedSize / 2;
  const centerY = top + fixedSize / 2;

  const dx = centerX - attractor.x;
  const dy = centerY - attractor.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  isInsideAttractor = distance < attractor.radius + fixedSize / 2;

  attempts++;
} while (isInsideAttractor && attempts < maxAttempts);

img.style.top = `${top}px`;
img.style.left = `${left}px`;


      const randomRotation = 45 * Math.floor(Math.random() * 360);
      img.dataset.rotation = randomRotation;

      img._base = { x: left, y: top }; // Store absolute base position
img._pos = {
  dragX: 0, // Position durch Drag
  dragY: 0,
  waveX: 0, // Position durch Wellenbewegung
  waveY: 0,
  currentX: 0,
  currentY: 0,
  settled: false,
  phaseX: Math.random() * Math.PI * 2,
  phaseY: Math.random() * Math.PI * 2,
  ampX: 10 + Math.random() * 15,
  ampY: 5 + Math.random() * 10,
  rotPhase: Math.random() * Math.PI * 2, // für Wackelrotation
};

      img.style.transform = `translate(0px, 0px) rotate(${randomRotation}deg)`;

      movables.push(img);
      playground.appendChild(img);
    }

    

    const attractorEl = document.createElement('div');
    attractorEl.className = 'attractor';
    attractorEl.style.left = `${attractor.x}px`;
    attractorEl.style.top = `${attractor.y}px`;
    playground.appendChild(attractorEl);

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

let globalWaveAngle = 0;

function animate() {
  globalWaveAngle += 0.01;

  movables.forEach((el) => {
    const pos = el._pos;
    const base = el._base;

    if (!pos.settled && !el.classList.contains("dragging")) {
      // 🌊 normale Wellenbewegung
      pos.waveX = Math.sin(globalWaveAngle + pos.phaseX) * pos.ampX;
      pos.waveY = Math.cos(globalWaveAngle + pos.phaseY) * pos.ampY;
    } else if (pos.settled && !el.classList.contains("dragging")) {
      // 🎯 wenn im Attractor und nicht gezogen
      pos.waveX = 0;
      pos.waveY = 0;

      const x = base.x + pos.dragX + el.offsetWidth / 2;
      const y = base.y + pos.dragY + el.offsetHeight / 2;

      const dx = attractor.x - x;
      const dy = attractor.y - y;

      pos.dragX += dx * 0.05;
      pos.dragY += dy * 0.05;
    }
    // 👉 Wenn dragging aktiv: keine Wellen, keine Attraction – nur Nutzerbewegung

    // Zielposition = Drag + Welle
    const targetX = pos.dragX + pos.waveX;
    const targetY = pos.dragY + pos.waveY;

    pos.currentX = lerp(pos.currentX, targetX, 0.05);
    pos.currentY = lerp(pos.currentY, targetY, 0.05);

    // leichte Wackelrotation nur wenn frei
    if (!pos.settled && !el.classList.contains("dragging")) {
      pos.rotPhase += 0.01;
    }
    const wobble = Math.sin(pos.rotPhase) * 5;
    const rotation = parseFloat(el.dataset.rotation) + wobble;

    el.style.transform = `translate(${pos.currentX}px, ${pos.currentY}px) rotate(${rotation}deg)`;
  });

  requestAnimationFrame(animate);
}




    animate();

    // Interact.js drag handling
    interact('.movable').draggable({
  listeners: {
    start(event) {
      event.target.classList.add('dragging');
    },
    move(event) {
      const pos = event.target._pos;
      pos.dragX += event.dx;
      pos.dragY += event.dy;
    },
    end(event) {
  event.target.classList.remove('dragging');

  const pos = event.target._pos;
  const base = event.target._base;

  const x = base.x + pos.dragX + pos.waveX + event.target.offsetWidth / 2;
  const y = base.y + pos.dragY + pos.waveY + event.target.offsetHeight / 2;

  const dx = attractor.x - x;
  const dy = attractor.y - y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < attractor.radius) {
    event.target.classList.add("in-zone");
    pos.settled = true;
  } else {
    event.target.classList.remove("in-zone");
    pos.settled = false; // zurück ins Schwimmen
  }

  setTimeout(checkCombination, 10);
}



  }
});


const projectImages = {};
for (let key in combinations) {
  const [kreis1, kreis2] = key.split("-");
  const file = combinations[key];
  projectImages[file] = [kreis1, kreis2];
}

document.querySelectorAll('#projektListe li a').forEach(link => {
  const file = link.dataset.file;

  // Klick-Handler: immer aktiv
  link.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
    openContent(file);
  });

  // Prüfen, ob es gültige Bilddaten gibt
  const kreise = projectImages[file];
  if (!kreise || kreise.length !== 2 || !kreise[0] || !kreise[1]) return;

  const [kreis1, kreis2] = kreise;

  const img1 = document.createElement("img");
  img1.src = `images/meerestiere/${kreis1}.png`;
  img1.className = "kreis-icon";

  const img2 = document.createElement("img");
  img2.src = `images/meerestiere/${kreis2}.png`;
  img2.className = "kreis-icon";

  const text = link.textContent;
  link.textContent = "";
  link.appendChild(img1);
  link.appendChild(document.createTextNode(" " + text + " "));
  link.appendChild(img2);
});





    // Bilder vergrößert anschauen
    function initLightbox() {
      const lightbox = document.getElementById("lightbox");
      const lightboxImg = lightbox.querySelector(".lightbox-img");
      const closeBtn = lightbox.querySelector(".lightbox-close");
      const images = Array.from(document.querySelectorAll(".clickable"));
      let currentIndex = 0;

      function showImage(index) {
        lightboxImg.src = images[index].src;
        lightboxImg.style.display = "block";
        lightbox.classList.remove("hidden");
      }

      images.forEach((img, index) => {
        img.addEventListener("click", () => {
          currentIndex = index;
          showImage(index);
        });
      });

      closeBtn.addEventListener("click", () => {
        lightbox.classList.add("hidden");
        lightboxImg.src = "";
        lightboxImg.style.display = "none";
      });
      

      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          lightbox.classList.add("hidden");
          lightboxImg.src = "";
        }
      });

      document.querySelector(".arrow.left").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
      });

      document.querySelector(".arrow.right").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      });
}

function loadProjectCSS() {
  if (!document.querySelector('link[href="projektseiten.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'projektseiten.css';
    document.head.appendChild(link);
  }
}

  // // Funktion zum Stoppen aller Audio- und Video-Elemente
  // function stopAllMedia() {
  //   document.querySelectorAll("audio, video").forEach(el => {
  //     el.pause?.();
  //     el.currentTime = 0;
  //   });
  // }

  // // Medien stoppen beim Schließen der Projektseiten
  // document.querySelector('.close').addEventListener('click', () => {
  //   stopAllMedia();
  //   document.querySelector('#contentWrapper').classList.toggle("hidden");
  // });

  // // Medien stoppen beim Seitenverlassen
  // window.addEventListener("beforeunload", stopAllMedia);
  // // window.addEventListener("unload", stopAllMedia); 
  // window.addEventListener("pagehide", stopAllMedia); 

  // // Medien stoppen beim Tab-Wechsel oder Ausblenden
  // document.addEventListener("visibilitychange", () => {
  //   if (document.visibilityState === "hidden") {
  //     stopAllMedia();
  //   }
  // });



function openContent(file) {

  fetch(file)
    .then(response => response.text())
    .then(data => {
      loadProjectCSS();
      let contentWrapper = document.querySelector('#contentWrapper');
      console.log(contentWrapper)
      contentWrapper.querySelector('.content .contentPage').innerHTML = data;
      contentWrapper.classList.remove("hidden");
      setTimeout(() => {
        const swiperElement = document.querySelector(".mySwiper");
        const isMenhirkure = document.querySelector(".projekt-menhirkure");
        if (swiperElement) {
          new Swiper(".mySwiper", {
            loop: true,
            spaceBetween: 20,
            centeredSlides: !isMenhirkure,
            slidesPerView: isMenhirkure ? 1 : 'auto',
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        }
        initLightbox();
      }, 100);

    })
    .catch(error => {
      console.error('Error loading content:', error);
    });
}