document.addEventListener("DOMContentLoaded", function () {
  const questions = document.querySelectorAll(".faq-accordion");

  questions.forEach((question) => {
    const questionText = question.querySelector(".faq-question");
    const answer = question.querySelector(".faq-answer");

    questionText.addEventListener("click", function () {
      answer.classList.add("show");
      // Si la respuesta está visible, programa su ocultación después de 4 segundos
      if (answer.classList.contains("show")) {
        setTimeout(function () {
          answer.classList.remove("show");
        }, 3000);
      }
    });
  });
});

/* formulario */
var btnAbrirPopup = document.getElementById("btn-abrir-popup"),
  overlay = document.getElementById("overlay"),
  popup = document.getElementById("popup"),
  btnCerrarPopup = document.getElementById("btn-cerrar-popup");

btnAbrirPopup.addEventListener("click", function () {
  overlay.classList.add("active");
  popup.classList.add("active");
});

btnCerrarPopup.addEventListener("click", function (e) {
  e.preventDefault();
  overlay.classList.remove("active");
  popup.classList.remove("active");
});

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
