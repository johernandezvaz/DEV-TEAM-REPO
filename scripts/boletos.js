document.querySelectorAll('.ticket-option input').forEach(input => {
    input.addEventListener('change', (e) => {
      document.querySelectorAll('.ticket-option').forEach(label => {
        if (label.querySelector('input').checked) {
          label.querySelector('.ticket-content').style.backgroundColor = '#4D869C';
          label.querySelector('.ticket-content').style.color = '#fff';
        } else {
          label.querySelector('.ticket-content').style.backgroundColor = '#fff';
          label.querySelector('.ticket-content').style.color = '#000';
        }
      });
    });
  });
  