document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("slider");

  const patrocinadores = [
    "patrocinador1.png",
    "patrocinador2.png",
    "patrocinador3.png",
    "patrocinador4.png",
    "patrocinador5.png",
  ];

  // Crear los elementos de patrocinadores originales y duplicados
  patrocinadores.forEach((src) => {
    const slide = document.createElement("div");
    slide.className = "slider-patrocinadores__slide";
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Patrocinador ${src.match(/\d+/)[0]}`;
    slide.appendChild(img);
    slider.appendChild(slide);
  });

  patrocinadores.forEach((src) => {
    const slide = document.createElement("div");
    slide.className = "slider-patrocinadores__slide";
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Patrocinador ${src.match(/\d+/)[0]}`;
    slide.appendChild(img);
    slider.appendChild(slide);
  });

  // Ajustar la animación para el deslizamiento continuo
  const cloneSlides = () => {
    patrocinadores.forEach((src) => {
      const slide = document.createElement("div");
      slide.className = "slider-patrocinadores__slide";
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Patrocinador ${src.match(/\d+/)[0]}`;
      slide.appendChild(img);
      slider.appendChild(slide);
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
