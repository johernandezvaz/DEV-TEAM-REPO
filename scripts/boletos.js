document.querySelectorAll('.ticket-option input').forEach(input => {
    input.addEventListener('change', (e) => {
      document.querySelectorAll('.ticket-option').forEach(label => {
        if (label.querySelector('input').checked) {
          label.querySelector('.ticket-option').style.backgroundColor = '#4D869C';
          label.querySelector('.ticket-option').style.color = '#fff';
        } else {
          label.querySelector('.ticket-option').style.backgroundColor = '#fff';
          label.querySelector('.ticket-option').style.color = '#000';
        }
      });
    });
  });
  