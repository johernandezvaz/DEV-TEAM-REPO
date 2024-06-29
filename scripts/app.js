document.addEventListener("DOMContentLoaded", function () {
  //Acordition FAQs
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

  /* FORMULARIO */
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

  // validacion input
  const email = {
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  };

  const inputNombre = document.querySelector("#nombre");
  const inputApellido = document.querySelector("#apellido");
  const inputEmail = document.querySelector("#email");
  const inputPhone = document.querySelector("#phone");
  const formulario = document.querySelector("#registroForm");
  const btnSubmit = document.querySelector(
    '#registroForm button[type="submit"]'
  );

  //eventos
  inputNombre.addEventListener("input", validar);
  inputApellido.addEventListener("input", validar);
  inputEmail.addEventListener("input", validar);
  inputPhone.addEventListener("input", validar);

  function validar(e) {
    if (e.target.value.trim() === "") {
      if (e.target.id == "phone") {
        mostrarAlerta(
          `El Campo telefono es obligatorio`,
          e.target.parentElement
        );
      } else {
        mostrarAlerta(
          `El Campo ${e.target.id} es obligatorio`,
          e.target.parentElement
        );
      }

      email[e.target.name] = "";
      comprobarEmail();
      return;
    }

    if (e.target.id === "email" && !validarEmail(e.target.value)) {
      mostrarAlerta("El email no es válido", e.target.parentElement);
      email[e.target.name] = "";
      comprobarEmail();
      return;
    }

    limpiarAlerta(e.target.parentElement);

    // Asignar los valores
    email[e.target.name] = e.target.value.trim().toLowerCase();

    /// Comprobar el objeto de email
    comprobarEmail();
  }

  function mostrarAlerta(mensaje, referencia) {
    limpiarAlerta(referencia);

    // Generar alerta en HTML
    const error = document.createElement("P");
    error.textContent = mensaje;
    error.classList.add(
      "bg-danger",
      "text-white",
      "p-1",
      "text-center",
      "my-1"
    );

    // Inyectar el error al formulario
    referencia.appendChild(error);
  }

  function limpiarAlerta(referencia) {
    // Comprueba si ya existe una alerta
    const alerta = referencia.querySelector(".bg-danger");
    if (alerta) {
      alerta.remove();
    }
  }

  function validarEmail(email) {
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    const resultado = regex.test(email);
    return resultado;
  }

  function comprobarEmail() {
    if (Object.values(email).includes("")) {
      btnSubmit.disabled = true;
      return;
    }
    btnSubmit.disabled = false;
  }
});
