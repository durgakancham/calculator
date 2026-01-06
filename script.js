const previousEl = document.getElementById("previous");
const currentEl = document.getElementById("current");
const keysContainer = document.querySelector(".keys");
const screen = document.querySelector(".screen");

let current = "0";
let previous = "";
let operator = null;
let justEvaluated = false;

function updateDisplay(pulse = false) {
  currentEl.textContent = current || "0";
  previousEl.textContent = previous;
  if (pulse) {
    screen.classList.add("pulse");
    setTimeout(() => screen.classList.remove("pulse"), 120);
  }
}

function appendNumber(num) {
  if (justEvaluated) {
    current = "0";
    justEvaluated = false;
  }

  if (num === "." && current.includes(".")) return;
  if (current === "0" && num !== ".") {
    current = num;
  } else {
    current += num;
  }
  updateDisplay(true);
}

function chooseOperator(op) {
  if (current === "" && !previous) return;
  if (previous && !justEvaluated) {
    calculate();
  } else {
    previous = current;
  }
  operator = op;
  current = "";
  justEvaluated = false;
  previousEl.textContent = `${previous} ${symbolFor(op)}`;
}

function symbolFor(op) {
  if (op === "/") return "÷";
  if (op === "*") return "×";
  return op;
}

function calculate() {
  if (!operator || current === "" || previous === "") return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if (isNaN(a) || isNaN(b)) return;

  let result;
  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = b === 0 ? "Error" : a / b;
      break;
    case "%":
      result = (a * b) / 100;
      break;
    default:
      return;
  }

  current = (result === "Error" ? "Error" : +result.toFixed(10)).toString();
  previous = "";
  operator = null;
  justEvaluated = true;
  updateDisplay(true);
}

function clearAll() {
  current = "0";
  previous = "";
  operator = null;
  justEvaluated = false;
  updateDisplay(true);
}

function deleteLast() {
  if (justEvaluated) {
    current = "0";
    justEvaluated = false;
    updateDisplay(true);
    return;
  }
  if (current.length <= 1) {
    current = "0";
  } else {
    current = current.slice(0, -1);
  }
  updateDisplay(true);
}

/* Click handling */
keysContainer.addEventListener("click", (e) => {
  const key = e.target.closest("button");
  if (!key) return;

  const number = key.dataset.number;
  const op = key.dataset.operator;
  const action = key.dataset.action;

  if (number !== undefined) {
    appendNumber(number);
    return;
  }
  if (op !== undefined) {
    chooseOperator(op);
    return;
  }

  if (action === "clear") {
    clearAll();
  } else if (action === "delete") {
    deleteLast();
  } else if (action === "equals") {
    calculate();
  }
});

/* Keyboard support */
window.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key)) {
    appendNumber(key);
  } else if (key === ".") {
    appendNumber(".");
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key.toLowerCase() === "c") {
    clearAll();
  }
});

updateDisplay();
