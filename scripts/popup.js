document.addEventListener('DOMContentLoaded', () => {
    const openPopup = document.getElementById('openPopup');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');

    openPopup.addEventListener('click', function(e) {
        e.preventDefault();
        popup.style.display = 'flex';
    });

    closePopup.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target == popup) {
            popup.style.display = 'none';
        }
    });
});
