const form = document.getElementById("my-form");
const answerDiv = document.getElementById("main");
const userQuestion = document.getElementById("user-question");
const botAnswer = document.getElementById("bot-answer");

form.addEventListener("submit", async event => {
  const inputQuestion = document.getElementById("question");
  event.preventDefault();
  const formData = new FormData(event.target);
  const question = formData.get("question");
  const response = await fetch("http://localhost:3000/", {
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
  <h3>回覆結果請在OLED螢幕上查看!</h3>`;
  answerDiv.appendChild(mainDiv);
});

//<p class="bot-message">A: ${data.answer}</p>`;
