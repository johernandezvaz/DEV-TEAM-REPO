document.addEventListener("DOMContentLoaded", function () {
  //Acordition FAQs
  const questions = document.querySelectorAll(".faq-accordion");
  let activeAnswer = null;
  let closeTimeout = null; // Para almacenar el temporizador

  questions.forEach((question) => {
    const questionText = question.querySelector(".faq-question");
    const answer = question.querySelector(".faq-answer");

    questionText.addEventListener("click", function (e) {
      e.stopPropagation();

      // Si hay una respuesta activa y no es la actual, ciérrala
      if (activeAnswer && activeAnswer !== answer) {
        activeAnswer.classList.remove("showAnswer");
        clearTimeout(closeTimeout); // Limpiar el temporizador si se abre otra respuesta
      }

      // Alterna la clase showAnswer para la respuesta actual
      answer.classList.toggle("showAnswer");

      // Establece la respuesta actual como activa si está visible
      if (answer.classList.contains("showAnswer")) {
        activeAnswer = answer;

        // Configura el temporizador para cerrar la respuesta después de 4 segundos
        closeTimeout = setTimeout(() => {
          if (activeAnswer) {
            activeAnswer.classList.remove("showAnswer");
            activeAnswer = null;
          }
        }, 3000);
      } else {
        activeAnswer = null;
        clearTimeout(closeTimeout); // Limpiar el temporizador si se cierra la respuesta manualmente
      }
    });
  });

  // Evento de clic en el documento para cerrar la respuesta activa
  document.addEventListener("click", function () {
    if (activeAnswer) {
      activeAnswer.classList.remove("showAnswer");
      activeAnswer = null;
      clearTimeout(closeTimeout); // Limpiar el temporizador cuando se cierra manualmente
    }
  });

  /* FORMULARIO */
  var btnsAbrirPopup = document.querySelectorAll(".btn-abrir-popup"),
    overlay = document.querySelector(".overlay"),
    popup = document.querySelector(".popup"),
    btnCerrarPopup = document.getElementById("btn-cerrar-popup");

  /* VALIDACION DE FORMULARIO */
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
  const asistenciaError = document.querySelector("#asistencia-error");
  const asistenciaRadios = document.getElementsByName("asistencia_rompehielos");

  // Eventos
  inputNombre.addEventListener("input", validar);
  inputApellido.addEventListener("input", validar);
  inputEmail.addEventListener("input", validar);
  inputPhone.addEventListener("input", validar);
  formulario.addEventListener("submit", validarAsistencia);

  // Validación de radio buttons de asistencia
  asistenciaRadios.forEach((radio) =>
    radio.addEventListener("change", validarAsistencia)
  );

  function validar(e) {
    if (e.target.value.trim() === "") {
      mostrarAlerta(`* Este campo es obligatorio`, e.target.parentElement);
      email[e.target.name] = "";
      comprobarEmail();
      return;
    }

    if (e.target.id === "email" && !validarEmail(e.target.value)) {
      mostrarAlerta("* El email no es válido", e.target.parentElement);
      email[e.target.name] = "";
      comprobarEmail();
      return;
    }

    limpiarAlerta(e.target.parentElement);

    // Asignar los valores
    email[e.target.name] = e.target.value.trim().toLowerCase();

    // Comprobar el objeto de email
    validarAsistencia(e);
    comprobarEmail();
  }

  function validarAsistencia(e) {
    let seleccionado = false;

    for (let i = 0; i < asistenciaRadios.length; i++) {
      if (asistenciaRadios[i].checked) {
        seleccionado = true;
        break;
      }
    }

    if (!seleccionado) {
      mostrarAlerta(
        "* Por favor, confirme su asistencia al evento rompehielos.",
        asistenciaError
      );
      e.preventDefault(); // Evita el envío del formulario
    } else {
      limpiarAlerta(asistenciaError);
    }

    comprobarEmail();
  }

  function mostrarAlerta(mensaje, referencia) {
    limpiarAlerta(referencia);

    // Generar alerta en HTML
    const error = document.createElement("P");
    error.textContent = mensaje;
    error.classList.add("p-1", "text-start", "my-1", "alerta-form");

    // Inyectar el error al formulario
    referencia.appendChild(error);
  }

  function limpiarAlerta(referencia) {
    // Comprueba si ya existe una alerta
    const alerta = referencia.querySelector(".alerta-form");
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
    if (Object.values(email).includes("") || !asistenciaRadiosSeleccionado()) {
      btnSubmit.disabled = true;
      return;
    }
    btnSubmit.disabled = false;
  }

  function asistenciaRadiosSeleccionado() {
    for (let i = 0; i < asistenciaRadios.length; i++) {
      if (asistenciaRadios[i].checked) {
        return true;
      }
    }
    return false;
  }
});

/* slider de imagenes */

const slides = document.querySelector(".slides");
const slideItems = document.querySelectorAll(".slide");
const totalSlides = slideItems.length;
const nextButton = document.querySelector(".next-button");
const prevButton = document.querySelector(".prev-button");

let currentIndex = 0;

// Function to show a specific slide
function showSlide(index) {
  const offset = -index * 100;
  slides.style.transform = `translateX(${offset}%)`;
}

// Function to go to the next slide
function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  showSlide(currentIndex);
}

// Function to go to the previous slide
function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  showSlide(currentIndex);
}

// Event listeners for navigation buttons
nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", prevSlide);

// Auto play the slider
setInterval(nextSlide, 5000); // Change slide every 5 seconds

// Initial display
showSlide(currentIndex);
