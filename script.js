const form = document.getElementById("my-form");
const answerDiv = document.getElementById("main");
const userQuestion = document.getElementById("user-question");
const botAnswer = document.getElementById("bot-answer");
const inputQuestion = document.getElementById("question");
const send = document.getElementById("send");

inputQuestion.addEventListener("keydown", e => {
  if (e.key == "Enter") {
    sendData();
  }
});

send.addEventListener("click", e => {
  sendData();
});

async function sendData() {
  inputQuestion.style.border = "0";
  if (inputQuestion.value == "") {
    inputQuestion.style.border = "1px solid #ff4346";
    return false;
  }
  const question = inputQuestion.value;
  send.disabled = true;
  inputQuestion.disabled = true;
  const response = await fetch("https://tssh-openai-project-server.vercel.app", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });
  inputQuestion.value = "";
  const data = await response.json();
  let mainDiv = document.createElement("div");
  mainDiv.className = "result";
  mainDiv.innerHTML = `
  <h2 id="user-message">Q: ${data.question}</h2>
  <p class="bot-message">A: ${data.answer}</p>`;
  answerDiv.appendChild(mainDiv);
  send.disabled = false;
  inputQuestion.disabled = false;
}
