document.addEventListener("DOMContentLoaded", function () {
  const questions = document.querySelectorAll(".faq-accordion");
  let activeAnswer = null;
  let nonActiveAnswer = "";
  console.log(nonActiveAnswer);

  questions.forEach((question) => {
    const questionText = question.querySelector(".faq-question");
    const answer = question.querySelector(".faq-answer");

    questionText.addEventListener("click", function (e) {
      e.stopPropagation();
      // Si hay una respuesta activa y no es la actual, ciérrala
      if (activeAnswer && activeAnswer !== answer) {
        activeAnswer.classList.remove("showAnswer");
      }
      // Alterna la clase showAnswer para la respuesta actual
      answer.classList.toggle("showAnswer");
      // Establece la respuesta actual como activa si está visible
      activeAnswer = answer.classList.contains("showAnswer") ? answer : null;
    });
  });

  // Evento de clic en el documento para cerrar la respuesta activa
  document.addEventListener("click", function () {
    if (activeAnswer) {
      activeAnswer.classList.remove("showAnswer");
      activeAnswer = null;
    }
  });
});

/* formulario */
var btnsAbrirPopup = document.querySelectorAll(".btn-abrir-popup"),
  overlay = document.querySelector(".overlay"),
  popup = document.querySelector(".popup"),
  btnCerrarPopup = document.getElementById("btn-cerrar-popup");

btnsAbrirPopup.forEach(function (btn) {
  btn.addEventListener("click", function () {
    overlay.classList.add("active");
    popup.classList.add("active");
  });
});

btnCerrarPopup.addEventListener("click", function (e) {
  e.preventDefault();
  overlay.classList.remove("active");
  popup.classList.remove("active");
});
