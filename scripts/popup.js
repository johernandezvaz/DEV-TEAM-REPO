document.addEventListener('DOMContentLoaded', () => {
    const openPopup = document.getElementById('openPopop');
    const popup = document.getElementById('popop');
    const closePopup = document.getElementById('closePopop');
    const comprarBoleto= document.getElementById('comprarEntrada');
    const body = document.body;

    if (openPopup && popup && closePopup && comprarBoleto) {
        openPopup.addEventListener('click', function(e) {
            e.preventDefault();
            popup.style.display = 'flex';
            body.classList.add('no-scroll');
        });

        closePopup.addEventListener('click', function() {
            popup.style.display = 'none';
            body.classList.remove('no-scroll');
        });

        comprarBoleto.addEventListener('click', function() {
            popup.style.display = 'none';
            body.classList.remove('no-scroll');
        });

        window.addEventListener('click', function(e) {
            if (e.target == popup) {
                popup.style.display = 'none';
                body.classList.remove('no-scroll');
            }
        });
    } else {
        console.error('Elementos no encontrados.');
    }
});
