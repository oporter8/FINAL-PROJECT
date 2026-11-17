const answerForms = document.querySelectorAll("[data-answer]");
const resetButton = document.querySelector("#reset-game");
const progressBar = document.querySelector("#progress-bar");
const progressText = document.querySelector("#progress-text");

let solvedRooms = JSON.parse(localStorage.getItem("solvedRooms")) || [];

function showMessage(messageElement, message, isCorrect) {
  messageElement.textContent = message;
  messageElement.className = isCorrect ? "message success" : "message error";
}

function updateProgress() {
  if (!progressBar || !progressText) {
    return;
  }

  const percent = Math.round((solvedRooms.length / 6) * 100);
  progressBar.style.width = percent + "%";
  progressText.textContent = solvedRooms.length + " of 6 rooms solved";
}

function solveRoom(roomName, messageElement) {
  if (!solvedRooms.includes(roomName)) {
    solvedRooms.push(roomName);
    localStorage.setItem("solvedRooms", JSON.stringify(solvedRooms));
  }

  showMessage(messageElement, "Correct! Room unlocked.", true);
  updateProgress();
}

function checkAnswer(event) {
  event.preventDefault();

  const form = event.target;
  const roomName = form.dataset.room;
  const correctAnswer = form.dataset.answer.toLowerCase();
  const userAnswer = form.querySelector("input, select").value.trim().toLowerCase();
  const messageElement = form.querySelector(".message");

  if (roomName === "final-lock" && solvedRooms.length < 5) {
    showMessage(messageElement, "The final lock is still powered down. Solve the first five rooms first.", false);
    return;
  }

  if (userAnswer === correctAnswer) {
    solveRoom(roomName, messageElement);
  } else {
    showMessage(messageElement, "That answer does not work. Study the clue and try again.", false);
  }
}

function resetGame() {
  localStorage.removeItem("solvedRooms");
  window.location.reload();
}

answerForms.forEach(function (form) {
  form.addEventListener("submit", checkAnswer);
});

if (resetButton) {
  resetButton.addEventListener("click", resetGame);
}

updateProgress();
