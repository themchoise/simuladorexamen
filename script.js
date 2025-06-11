let questions = [];

fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    renderQuestions();
  });

function renderQuestions() {
  const container = document.getElementById('quiz-container');
  questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.classList.add('question-block');

    const title = document.createElement('p');
    title.innerText = `${i + 1}. ${q.question}`;
    div.appendChild(title);

    q.options.forEach((opt, j) => {
      const label = document.createElement('label');
      label.innerHTML = `
        <input type="radio" name="question-${i}" value="${j}" />
        ${opt}
      `;
      div.appendChild(label);
      div.appendChild(document.createElement('br'));
    });

    container.appendChild(div);
  });
}

function submitExam() {
  let score = 0;

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="question-${i}"]:checked`);
    if (selected && parseInt(selected.value) === q.answer) {
      score++;
    }
  });

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<h2>Obtuviste ${score} de ${questions.length} respuestas correctas.</h2>`;
}