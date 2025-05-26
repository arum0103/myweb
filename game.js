const canvas = document.getElementById("ladder-canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-btn");
const nameInput = document.getElementById("name-input");
const resultInput = document.getElementById("result-input");
const winnersDiv = document.getElementById("winners");

let names = [];
let results = [];
let spacingX = 0;
const spacingY = 50;
const rowCount = 8;
let verticalLines = [];
let horizontalLines = [];

function initLadder() {
  verticalLines = [];
  horizontalLines = [];
  spacingX = canvas.width / (names.length + 1);

  for (let i = 1; i <= names.length; i++) {
    verticalLines.push({
      x: spacingX * i,
      y1: spacingY,
      y2: spacingY * rowCount,
    });
  }

  for (let r = 1; r < rowCount; r++) {
    let y = spacingY * r;
    let rand = Math.floor(Math.random() * (names.length - 1));
    horizontalLines.push({
      x1: spacingX * (rand + 1),
      x2: spacingX * (rand + 2),
      y: y,
    });
  }
}

function drawLadder() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;

  verticalLines.forEach((line) => {
    ctx.beginPath();
    ctx.moveTo(line.x, line.y1);
    ctx.lineTo(line.x, line.y2);
    ctx.stroke();
  });

  horizontalLines.forEach((line) => {
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y);
    ctx.lineTo(line.x2, line.y);
    ctx.stroke();
  });

  ctx.fillStyle = "#ff69b4";
  ctx.font = "14px Arial";
  names.forEach((name, i) => {
    let x = spacingX * (i + 1);
    ctx.fillText(name, x - 20, spacingY - 15);
    ctx.fillText(results[i], x - 20, spacingY * rowCount + 20);
  });
}

function simulateLadder(index) {
  let x = spacingX * (index + 1);
  let y = spacingY;
  const path = [];
  path.push({ x, y });

  while (y < spacingY * rowCount) {
    y += 5;
    for (let line of horizontalLines) {
      if (Math.abs(y - line.y) < 3) {
        if (Math.abs(x - line.x1) < 2) {
          x = line.x2;
          break;
        } else if (Math.abs(x - line.x2) < 2) {
          x = line.x1;
          break;
        }
      }
    }
    path.push({ x, y });
  }

  drawLadder();
  ctx.strokeStyle = "#ff3e6c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let point of path) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();

  // 결과 인덱스 찾기
  let resultIndex = verticalLines.findIndex(v => Math.abs(v.x - path[path.length - 1].x) < 5);
  return resultIndex;
}

startBtn.addEventListener("click", () => {
  const nameStr = nameInput.value.trim();
  const resultStr = resultInput.value.trim();

  if (!nameStr || !resultStr) {
    alert("이름과 결과를 모두 입력해주세요!");
    return;
  }

  names = nameStr.split(",").map(n => n.trim()).filter(n => n.length > 0);
  results = resultStr.split(",").map(r => r.trim()).filter(r => r.length > 0);

  if (names.length < 2 || results.length !== names.length) {
    alert("이름과 결과 수를 동일하게 입력해주세요!");
    return;
  }

  winnersDiv.innerHTML = "";

  initLadder();
  drawLadder();

  let i = 0;
  const finalResults = [];

  function runEach() {
    if (i < names.length) {
      const resultIndex = simulateLadder(i);
      finalResults.push(`${names[i]} 👉 ${results[resultIndex]}`);
      i++;
      setTimeout(runEach, 1000);
    } else {
      winnersDiv.innerHTML = "🎉 결과:<br><br>" + finalResults.map(r => `💖 ${r}`).join("<br>");
    }
  }

  setTimeout(runEach, 500);
});
