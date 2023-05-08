//Declare Variable
const form = document.getElementById("my-form");
const answerDiv = document.getElementById("main");
const userQuestion = document.getElementById("user-question");
const botAnswer = document.getElementById("bot-answer");
const inputQuestion = document.getElementById("question");
const send = document.getElementById("send");
const circleBox = document.getElementById("circleBox");
const circle = document.getElementById("circle");

//I Keydown Event
inputQuestion.addEventListener("keydown", e => {
  if (e.key == "Enter") {
    setTimeout(() => {
      addAnimation();
    }, 1000);
    sendData();
  }
});

//Button Click Event
send.addEventListener("click", () => {
  setTimeout(() => {
    addAnimation();
  }, 1000);
  sendData();
});

//Add CSS Loading Animation
function addAnimation() {
  circleBox.classList.add("loader-container");
  circle.classList.add("loader");
}

//Remove CSS Loading Animation
function removeAnimation() {
  circleBox.classList.remove("loader-container");
  circle.classList.remove("loader");
}

//Call nodeJS Server Function
async function sendData() {
  inputQuestion.style.border = "0";
  if (inputQuestion.value == "") {
    inputQuestion.style.border = "1px solid #ff4346";
    return false;
  }
  const question = inputQuestion.value;
  send.disabled = true;
  inputQuestion.disabled = true;
  //Fetch Server API
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
  removeAnimation();
  connectWebduino(data);
  //Render HTML Element
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
      const text = data.answer.content;
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
        if (Y > 70) {
          Y = 70;
        }
      });
    }
  );
}

//Clear Answer
const reset = document.getElementById("reset");
reset.addEventListener("click", () => {
  main.innerHTML = "";
});
