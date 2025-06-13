let questions = [];
let questionsTesting = [];
let examContainer = document.getElementById("quiz-container");
let btnTallerCom = document.getElementById("btnTallerCom");
let totalSpan = document.getElementById("total");
let answeredSpan = document.getElementById("answered");
let btnTest = document.getElementById("btntest");
let btnSendResp = document.getElementById("sendrep");
let resultDiv = document.getElementById("result");

let currentQuestions = []; // <-- Variable global para saber qué array se está usando

fetch("questionsTallerCom.json")
  .then((res) => res.json())
  .then((data) => {
    questions = data;
  });
fetch("questionsTesting.json")
  .then((res) => res.json())
  .then((data) => {
    questionsTesting = data;
  });

function updateAnsweredCount() {
  // Cuenta cuántas preguntas tienen una opción seleccionada
  const totalQuestions = document.querySelectorAll(".question-block").length;
  let answered = 0;
  for (let i = 0; i < totalQuestions; i++) {
    if (document.querySelector(`input[name="question-${i}"]:checked`)) {
      answered++;
    }
  }
  answeredSpan.textContent = answered;
}

function renderQuestions(fileselect) {
  btnSendResp.style.display = "block";
  currentQuestions = fileselect === "test" ? questionsTesting : questions; // <-- Guardar referencia
  totalSpan.textContent = currentQuestions.length;
  answeredSpan.textContent = 0;
  examContainer.innerHTML = ""; // Clear previous content
  document.getElementById("progress-fixed").style.display = "block";

  currentQuestions.forEach((q, i) => {
    const div = document.createElement("div");
    div.classList.add("question-block");

    const title = document.createElement("p");
    title.innerText = `${i + 1}. ${q.question}`;
    div.appendChild(title);

    q.options.forEach((opt, j) => {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="radio" name="question-${i}" value="${j}" />
        ${opt}
      `;
      // Actualiza el contador cada vez que se selecciona una opción
      label
        .querySelector("input")
        .addEventListener("change", updateAnsweredCount);
      div.appendChild(label);
      div.appendChild(document.createElement("br"));
    });

    examContainer.appendChild(div);
  });
}

function submitExam(e) {
  let score = 0;
  currentQuestions.forEach((q, i) => {
    const selected = document.querySelector(
      `input[name="question-${i}"]:checked`
    );
    if (selected && parseInt(selected.value) === q.answer) {
      score++;
    }
  });

  let html = `<h2>Obtuviste ${score} de ${currentQuestions.length} respuestas correctas.</h2>`;

  // Si el puntaje es 100%, mostrar QR con mensaje especial
  if (score === currentQuestions.length && currentQuestions.length > 0) {
    const qrMsg = encodeURIComponent(
      "felicidades hermoso , hermosa te va a ir bien el viernes"
    );
    html += `
      <div id="qr-overlay" style="
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.85);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999;">
        <div id="qr-container" style="background: #181818; padding: 32px 40px; border-radius: 18px; box-shadow: 0 4px 32px #000; display: flex; flex-direction: column; align-items: center;">
          <p style="font-size:1.2em; text-align:center; color: #fff; margin-bottom: 18px;">¡Felicidades! Escaneá el QR:</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrMsg}" alt="QR Felicidades" style="display:block; margin:auto;" />
          <button id="close-qr" style="margin-top:24px; padding:10px 24px; border:none; border-radius:6px; background:#fff; color:#181818; font-weight:bold; cursor:pointer;">Cerrar</button>
        </div>
      </div>
    `;
  }

  resultDiv.innerHTML = html;

  // Centrar y scroll al QR si existe
  setTimeout(() => {
    const qrOverlay = document.getElementById("qr-overlay");
    if (qrOverlay) {
      // Evita scroll en el body mientras el overlay está activo
      document.body.style.overflow = "hidden";
      // Botón para cerrar el overlay y restaurar scroll
      document.getElementById("close-qr").onclick = () => {
        qrOverlay.remove();
        document.body.style.overflow = "";
      };
    }
  }, 100);
}

btnTest.addEventListener("click", function () {
  examContainer.style.display = "block";
  renderQuestions("test");
});

btnTallerCom.addEventListener("click", function () {
  examContainer.style.display = "block";
  renderQuestions("taller");
});
