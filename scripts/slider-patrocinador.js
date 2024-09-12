document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("slider");

  const patrocinadores = [
    "patrocinador1.png",
    "patrocinador2.png",
    "patrocinador3.png",
    "patrocinador4.webp",
    "patrocinador5.png",
    "patrocinador6.png",
    "patrocinador7.jpg",
    "patrocinador8.png",
    "patrocinador9.png",
  ];

  // Función para crear un slide
  const createSlide = (src) => {
    const slide = document.createElement("div");
    slide.className = "slider-patrocinadores__slide";
    const img = document.createElement("img");
    img.src = `assets/${src}`;
    img.alt = `Patrocinador ${src.match(/\d+/)[0]}`;
    slide.appendChild(img);
    return slide;
  };

  // Crear los elementos de patrocinadores originales y duplicados
  patrocinadores.forEach((src) => {
    slider.appendChild(createSlide(src));
  });

  patrocinadores.forEach((src) => {
    slider.appendChild(createSlide(src));
  });

  // Ajustar la animación para el deslizamiento continuo
  const cloneSlides = () => {
    patrocinadores.forEach((src) => {
      slider.appendChild(createSlide(src));
    });
  };

  // Clonar las slides continuamente para mantener el bucle infinito
  setInterval(() => {
    cloneSlides();
  }, 20000); // Ajustar el tiempo según la duración de la animación

  slider.addEventListener("animationiteration", () => {
    slider.style.animation = "none";
    requestAnimationFrame(() => {
      slider.style.animation = "";
    });
  });
});
