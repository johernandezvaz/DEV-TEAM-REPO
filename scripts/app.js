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
