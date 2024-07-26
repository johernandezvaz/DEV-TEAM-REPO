document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("slider");

  const patrocinadores = [
    "patrocinador1.png",
    "patrocinador2.png",
    "patrocinador3.png",
    "patrocinador4.png",
    "patrocinador5.png",
  ];

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

  setInterval(() => {
    cloneSlides();
  }, 20000); // duración de la animación

  slider.addEventListener("animationiteration", () => {
    slider.style.animation = "none";
    requestAnimationFrame(() => {
      slider.style.animation = "";
    });
  });
});
