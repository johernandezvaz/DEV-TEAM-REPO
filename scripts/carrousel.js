// script.js
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.partner-carousel');
    const originalItems = Array.from(carousel.children);
    
    // Clona el contenido varias veces para asegurar un bucle infinito
    for (let i = 0; i < 5; i++) {
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            carousel.appendChild(clone);
        });
    }
});
