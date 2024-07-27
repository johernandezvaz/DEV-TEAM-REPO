document.addEventListener("DOMContentLoaded", function () {
  const ticketOptions = document.querySelectorAll(".ticket-option");

  ticketOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove 'selected' class from all options
      ticketOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add 'selected' class to the clicked option
      this.classList.add("selected");

      // Update the radio button state
      const input = this.querySelector('input[type="radio"]');
      if (input) {
        input.checked = true;
      }
    });
  });
});
