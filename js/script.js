
function toggleMenu() {
  var menu = document.getElementById("mobileMenu");
  if (menu) {
    menu.classList.toggle("open");
  }
}
var questions = [
  {
    question: "Hva brukes en dreiebenk til?",
    options: ["Sveising", "Bearbeiding av roterende materialer", "Maling", "Montering"],
    correct: 1
  },
  {
    question: "Hva er sveising?",
    options: ["Kutte metall", "Smelte sammen materialer", "Male metall", "Polere metall"],
    correct: 1
  },
  {
    question: "Hva er en CNC-maskin?",
    options: ["Manuell maskin", "Datastyrt maskin for produksjon", "Håndverktøy", "Sveiseapparat"],
    correct: 1
  },
  {
    question: "Hva er toleranse i produksjon?",
    options: ["Maks temperatur", "Tillatt avvik i mål", "Maskinstørrelse", "Produksjonstid"],
    correct: 1
  },
  {
    question: "Hva er hydraulikk?",
    options: ["Kraftoverføring med væske", "Kraftoverføring med luft", "Elektrisk kraft", "Varme"],
    correct: 0
  },
  {
    question: "Hva er pneumatikk?",
    options: ["Luftbasert kraftsystem", "Elektrisk motor", "Vannsystem", "Sveising"],
    correct: 0
  },
  {
    question: "Hva er HMS?",
    options: ["Helse, miljø og sikkerhet", "Høy maskin standard", "Hoved maskin system", "Industriell standard"],
    correct: 0
  },
  {
    question: "Hva brukes en mikrometer til?",
    options: ["Måle temperatur", "Måle svært små lengder nøyaktig", "Måle vekt", "Måle strøm"],
    correct: 1
  },
  {
    question: "Hva er en legering?",
    options: ["Rent metall", "Blandinger av metaller", "Plastmateriale", "Keramikk"],
    correct: 1
  },
  {
    question: "Hva er automatisering i industri?",
    options: ["Manuell produksjon", "Bruk av maskiner og systemer til å styre produksjon automatisk", "Mindre maskiner", "Mindre arbeid"],
    correct: 1
  },
  {
    question: "Se på videoen, hvilken er riktig?",
    options: ["A", "B", "C"],
    correct: 1,
    videoSrc: "img/MicrosoftTeams-video (16).mp4",
    keepOptionOrder: true
  }
];

var currentQuestion = 0;
var score = 0;
var selectedAnswer = null;

function initQuiz() {
  var quizBox = document.getElementById("quizBox");
  if (!quizBox) return;

  showQuestion(); 
}

function getShuffledIndices(length) {
  var indices = [];
  for (var i = 0; i < length; i++) {
    indices.push(i);
  }

  for (var j = indices.length - 1; j > 0; j--) {
    var randomIndex = Math.floor(Math.random() * (j + 1));
    var temp = indices[j];
    indices[j] = indices[randomIndex];
    indices[randomIndex] = temp;
  }

  return indices;
}

function getOrderedIndices(length) {
  var indices = [];
  for (var i = 0; i < length; i++) {
    indices.push(i);
  }
  return indices;
}

function showQuestion() {
  var q = questions[currentQuestion];
  document.getElementById("questionCount").textContent = "Spørsmål " + (currentQuestion + 1) + " av " + questions.length;
  document.getElementById("progressFill").style.width = ((currentQuestion + 1) / questions.length * 100) + "%";
  document.getElementById("scoreDisplay").textContent = "Poeng: " + score;
  document.getElementById("questionText").textContent = q.question;
  renderQuestionMedia(q);

  var container = document.getElementById("optionsContainer");
  container.innerHTML = "";
  selectedAnswer = null;
  var shuffledOptionIndices = q.keepOptionOrder
    ? getOrderedIndices(q.options.length)
    : getShuffledIndices(q.options.length);

  for (var i = 0; i < shuffledOptionIndices.length; i++) {
    var optionIndex = shuffledOptionIndices[i];
    var btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = q.options[optionIndex];
    btn.setAttribute("data-index", optionIndex);
    btn.onclick = function () {
      handleAnswer(parseInt(this.getAttribute("data-index")));
    };
    container.appendChild(btn);
  }

  document.getElementById("feedbackContainer").innerHTML = "";
  document.getElementById("nextBtn").classList.add("hidden");
}

function renderQuestionMedia(question) {
  var questionText = document.getElementById("questionText");
  var mediaContainer = document.getElementById("questionMedia");

  if (!mediaContainer) {
    mediaContainer = document.createElement("div");
    mediaContainer.id = "questionMedia";
    mediaContainer.className = "question-media";
    questionText.insertAdjacentElement("afterend", mediaContainer);
  }

  mediaContainer.innerHTML = "";

  if (!question.videoSrc) {
    mediaContainer.classList.add("hidden");
    return;
  }

  mediaContainer.classList.remove("hidden");
  var video = document.createElement("video");
  video.className = "quiz-video";
  video.setAttribute("controls", "");
  video.setAttribute("preload", "metadata");

  var source = document.createElement("source");
  source.src = question.videoSrc;
  source.type = "video/mp4";
  video.appendChild(source);

  mediaContainer.appendChild(video);
}

function handleAnswer(index) {
  if (selectedAnswer !== null) return;
  selectedAnswer = index;

  var q = questions[currentQuestion];
  var buttons = document.querySelectorAll(".quiz-option");

  for (var i = 0; i < buttons.length; i++) {
    var buttonOptionIndex = parseInt(buttons[i].getAttribute("data-index"));
    buttons[i].disabled = true;
    if (buttonOptionIndex === q.correct) {
      buttons[i].classList.add("correct");
    } else if (buttonOptionIndex === index && index !== q.correct) {
      buttons[i].classList.add("wrong");
    } else {
      buttons[i].classList.add("dimmed");
    }
  }

  var feedback = document.getElementById("feedbackContainer");
  if (index === q.correct) {
    score++;
    feedback.innerHTML = '<p class="quiz-feedback correct">✅ Riktig!</p>';
  } else {
    feedback.innerHTML = '<p class="quiz-feedback wrong">❌ Feil! Riktig svar: ' + q.options[q.correct] + '</p>';
  }

  var nextBtn = document.getElementById("nextBtn");
  nextBtn.classList.remove("hidden");
  if (currentQuestion < questions.length - 1) {
    nextBtn.textContent = "Neste Spørsmål";
  } else {
    nextBtn.textContent = "Se Resultat";
  }
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quizBox").classList.add("hidden");
  var resultBox = document.getElementById("resultBox");
  resultBox.classList.remove("hidden");
  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalTotal").textContent = questions.length;
  document.getElementById("nameInput").classList.remove("hidden");
  document.getElementById("savedMsg").classList.add("hidden");
  renderHighscores();
}

function saveName() {
  var name = document.getElementById("playerName").value.trim();
  if (name === "") return;

  var highscores = getHighscores();
  highscores.push({ name: name, score: score });
  highscores.sort(function (a, b) { return b.score - a.score; });
  highscores = highscores.slice(0, 5);
  localStorage.setItem("bleiker-highscores", JSON.stringify(highscores));

  document.getElementById("nameInput").classList.add("hidden");
  document.getElementById("savedMsg").classList.remove("hidden");
  renderHighscores();
}

function getHighscores() {
  var data = localStorage.getItem("bleiker-highscores");
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

function renderHighscores() {
  var highscores = getHighscores();
  var container = document.getElementById("highscoreList");
  if (!container) return;

  if (highscores.length === 0) {
    container.innerHTML = '<p class="small-text">Ingen highscores ennå!</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < highscores.length; i++) {
    html += '<div class="highscore-entry">';
    html += '<span class="name">' + (i + 1) + '. ' + highscores[i].name + '</span>';
    html += '<span class="score">' + highscores[i].score + '/' + questions.length + '</span>';
    html += '</div>';
  }
  container.innerHTML = html;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  document.getElementById("resultBox").classList.add("hidden");
  document.getElementById("quizBox").classList.remove("hidden");
  document.getElementById("playerName").value = "";
  showQuestion();
}

function downloadGrafiskProfilPdf() {
  var button = document.getElementById("downloadPdfBtn");
  var content = document.getElementById("grafiskProfilInnhold");

  if (!button || !content || typeof window.html2pdf !== "function") {
    return;
  }

  var originalText = button.textContent;
  button.disabled = true;
  button.textContent = "LAGER PDF...";

  window.html2pdf().set({
    margin: 10,
    filename: "BleikerQuizzen-Grafisk-Profil.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  }).from(content).save().catch(function () {
    window.alert("Kunne ikke laste ned PDF akkurat nå.");
  }).finally(function () {
    button.disabled = false;
    button.textContent = originalText;
  });
}

function initPdfDownload() {
  var button = document.getElementById("downloadPdfBtn");

  if (!button) {
    return;
  }

  button.addEventListener("click", downloadGrafiskProfilPdf);
}
document.addEventListener("DOMContentLoaded", function () {
  initQuiz();
  initPdfDownload();
});