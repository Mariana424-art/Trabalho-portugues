document.documentElement.classList.add('js');
const slides = [...document.querySelectorAll('.slide')];
const nav = document.querySelector('#sectionNav');
let current = 0;

slides.forEach((slide, index) => {
  const button = document.createElement('button');
  button.textContent = slide.dataset.title;
  button.addEventListener('click', () => showSlide(index));
  nav.append(button);
});

function showSlide(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  slides[current].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateControls();
}
function updateControls() {
  [...nav.children].forEach((button, index) => button.classList.toggle('current', index === current));
  document.querySelector('#prev').disabled = current === 0;
  document.querySelector('#next').disabled = current === slides.length - 1;
  document.querySelector('#progress').style.setProperty('--progress', `${((current + 1) / slides.length) * 100}%`);
}
document.querySelector('#prev').addEventListener('click', () => showSlide(current - 1));
document.querySelector('#next').addEventListener('click', () => showSlide(current + 1));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showSlide(slides.findIndex(slide => slide.id === button.dataset.go))));
window.addEventListener('keydown', event => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;
  if (event.key === 'ArrowRight') showSlide(current + 1);
  if (event.key === 'ArrowLeft') showSlide(current - 1);
});
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('in'); current = slides.indexOf(entry.target); updateControls(); }
}), { threshold: .55 });
slides.forEach(slide => observer.observe(slide));
document.querySelector('#fullScreen').addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());

const questions = [
  { text: 'Eu nunca me esqueci ___ conselho que recebi.', options: ['A) o', 'B) do', 'C) ao', 'D) pelo'], answer: 1, explanation: '“Esquecer-se de algo” é uma construção pronominal. De + o = do.' },
  { text: 'Qual frase está de acordo com a norma-padrão?', options: ['A) Eu quero aos meus amigos na festa.', 'B) Eu quero bem aos meus avós.', 'C) Eu me esqueci o compromisso.', 'D) Eu agradeci a professora a ajuda.'], answer: 1, explanation: '“Querer bem a alguém” expressa afeto. Nas demais, a regência não corresponde ao sentido ou à construção.' },
  { text: 'Na norma-padrão, podemos escrever tanto “Esqueci a tarefa” quanto “Esqueci-me da tarefa”.', options: ['A) Verdadeiro', 'B) Falso'], answer: 0, explanation: 'As duas construções são aceitas. A segunda é pronominal e exige a preposição de.' },
  { text: 'Os estudantes agradeceram ___ professora ___ explicação.', options: ['A) a / a', 'B) à / a', 'C) da / pela', 'D) pela / à'], answer: 1, explanation: '“À professora” é o destinatário, introduzido por a + a. “A explicação” é objeto direto.' }
];
const quiz = document.querySelector('#quiz');
let answered = new Set(); let score = 0;
function renderQuiz() {
  quiz.innerHTML = '';
  questions.forEach((question, qIndex) => {
    const card = document.createElement('article'); card.className = 'question';
    card.innerHTML = `<h3><span class="q-number">QUESTÃO ${qIndex + 1}</span>${question.text}</h3><div class="options"></div><p class="feedback"></p>`;
    const options = card.querySelector('.options'); const feedback = card.querySelector('.feedback');
    question.options.forEach((option, index) => {
      const button = document.createElement('button'); button.className = 'option'; button.textContent = option;
      button.addEventListener('click', () => {
        if (answered.has(qIndex)) return;
        answered.add(qIndex); const correct = index === question.answer;
        if (correct) score++;
        [...options.children].forEach((item, optionIndex) => { item.disabled = true; if (optionIndex === question.answer) item.classList.add('correct-answer'); });
        if (!correct) button.classList.add('wrong-answer');
        feedback.innerHTML = `<strong>${correct ? '✓ Correto!' : '✕ Quase!'}</strong> ${question.explanation}`; feedback.classList.add('show');
        updateScore();
      }); options.append(button);
    }); quiz.append(card);
  }); updateScore();
}
function updateScore() {
  document.querySelector('#score strong').textContent = score;
  const message = document.querySelector('#quizMessage');
  message.textContent = answered.size === questions.length ? `Resultado final: ${score} de ${questions.length} acertos. ${score === 4 ? 'Excelente domínio!' : 'Revise as explicações e tente novamente.'}` : `Você respondeu ${answered.size} de ${questions.length} questões.`;
}
document.querySelector('#resetQuiz').addEventListener('click', () => { answered = new Set(); score = 0; renderQuiz(); });
renderQuiz(); updateControls();

requestAnimationFrame(() => slides[0].classList.add('in'));
