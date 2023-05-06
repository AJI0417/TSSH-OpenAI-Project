const form = document.getElementById("my-form");
const answerDiv = document.getElementById("main");
const userQuestion = document.getElementById("user-question");
const botAnswer = document.getElementById("bot-answer");
const inputQuestion = document.getElementById("question");
const send = document.getElementById("send");
let circleBox = document.getElementById("circleBox");
let circle = document.getElementById("circle");

inputQuestion.addEventListener("keydown", e => {
  if (e.key == "Enter") {
    setTimeout(() => {
      addAnimation();
    }, 1000);
    sendData();
  }
});

send.addEventListener("click", () => {
  setTimeout(() => {
    addAnimation();
  }, 1000);
  sendData();
});

function addAnimation() {
  circleBox.classList.add("loader-container");
  circle.classList.add("loader");
}

function removeAnimation() {
  circleBox.classList.remove("loader-container");
  circle.classList.remove("loader");
}

async function sendData() {
  inputQuestion.style.border = "0";
  if (inputQuestion.value == "") {
    inputQuestion.style.border = "1px solid #ff4346";
    return false;
  }
  const question = inputQuestion.value;
  send.disabled = true;
  inputQuestion.disabled = true;
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
  removeAnimation();
  //connectWebduino(data);
  let mainDiv = document.createElement("div");
  mainDiv.className = "result";
  mainDiv.innerHTML = `
  <h2 id="user-message">Q: ${data.question}</h2>
  <p class="bot-message">A: ${data.answer.content}</p>`;
  answerDiv.appendChild(mainDiv);
  send.disabled = false;
  inputQuestion.disabled = false;
}

//connect webduino
function connectWebduino(data) {
  let oled;
  boardReady(
    { board: "Smart", device: "mRL23", transport: "mqtt" },
    function (board) {
      board.samplingInterval = 50;
      oled = getSSD1306(board);
      oled.textSize = 1;
      const text = data;
      console.log("text", text);
      const segments = text.split(/[,.!]/);
      console.log("segments", segments);
      let Y = 0;
      segments.forEach(segment => {
        oled.cursorX = 0;
        oled.cursorY = Y;
        oled.print(segment.trim());
        Y += 10;
        console.log(Y);
        if (Y > 60) {
          Y = 60;
        }
      });
    }
  );
}
