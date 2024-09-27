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
    "patrocinador11.png",
    "patrocinador12.png",
    "patrocinador13.png",
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

  // Crear los elementos de patrocinadores originales
  patrocinadores.forEach((src) => {
    slider.appendChild(createSlide(src));
  });

  // Clonar los slides para mantener un bucle infinito sin interrupciones
  const cloneSlides = () => {
    const slides = [...slider.children];
    slides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      slider.appendChild(clone);
    });
  };

  // Clonar una vez para duplicar el contenido
  cloneSlides();

  // Controlar la animación continua
  slider.addEventListener("animationiteration", () => {
    slider.style.animation = "none";
    requestAnimationFrame(() => {
      slider.style.animation = "";
    });
  });
});
