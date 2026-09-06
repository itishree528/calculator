const display = document.getElementById("display");
const previousDisplay = document.getElementById("previousDisplay");

const buttons = document.querySelectorAll("[data-value]");
const actionButtons = document.querySelectorAll("[data-action]");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");
const themeBtn = document.getElementById("themeBtn");

let currentInput = "";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;


// ===============================
// Number buttons
// ===============================

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;

        if ("0123456789.".includes(value)) {
            enterNumber(value);
        }

        else if (["+", "-", "*", "/", "%"].includes(value)) {
            chooseOperator(value);
        }

    });

});


// ===============================
// Enter number
// ===============================

function enterNumber(value) {

    if (shouldResetDisplay) {
        currentInput = "";
        shouldResetDisplay = false;
    }

    if (value === "." && currentInput.includes(".")) {
        return;
    }

    if (currentInput === "0" && value !== ".") {
        currentInput = value;
    }

    else {
        currentInput += value;
    }

    updateDisplay();
}


// ===============================
// Choose operator
// ===============================

function chooseOperator(selectedOperator) {

    if (currentInput === "") {
        return;
    }

    if (operator !== null && previousInput !== "") {
        calculate();
    }

    previousInput = currentInput;
    operator = selectedOperator;
    shouldResetDisplay = true;

    previousDisplay.textContent =
        `${previousInput} ${getOperatorSymbol(operator)}`;
}


// ===============================
// Calculate
// ===============================

function calculate() {

    if (
        previousInput === "" ||
        currentInput === "" ||
        operator === null
    ) {
        return;
    }

    const firstNumber = Number(previousInput);
    const secondNumber = Number(currentInput);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {
                display.value = "Error";
                resetCalculator();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        case "%":
            result = firstNumber % secondNumber;
            break;

    }

    result = Number(result.toFixed(10));

    const expression =
        `${previousInput} ${getOperatorSymbol(operator)} ${currentInput}`;

    addToHistory(expression, result);

    previousDisplay.textContent = expression;

    currentInput = String(result);

    previousInput = "";
    operator = null;

    shouldResetDisplay = true;

    updateDisplay();
}


// ===============================
// Actions
// ===============================

actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "backspace") {
            backspace();
        }

        if (action === "sign") {
            changeSign();
        }

        if (action === "calculate") {
            calculate();
        }

    });

});


// ===============================
// Clear calculator
// ===============================

function clearCalculator() {

    currentInput = "";
    previousInput = "";
    operator = null;

    previousDisplay.textContent = "";

    updateDisplay();
}


// ===============================
// Backspace
// ===============================

function backspace() {

    if (shouldResetDisplay) {
        return;
    }

    currentInput = currentInput.slice(0, -1);

    updateDisplay();
}


// ===============================
// Positive / Negative
// ===============================

function changeSign() {

    if (currentInput === "") {
        return;
    }

    currentInput =
        String(Number(currentInput) * -1);

    updateDisplay();
}


// ===============================
// Update display
// ===============================

function updateDisplay() {

    display.value =
        currentInput || "0";
}


// ===============================
// Operator symbols
// ===============================

function getOperatorSymbol(operator) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };

    return symbols[operator];
}


// ===============================
// History
// ===============================

function addToHistory(expression, result) {

    const history =
        JSON.parse(localStorage.getItem("calculatorHistory")) || [];

    history.unshift({
        expression: expression,
        result: result
    });

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );

    displayHistory();
}


// ===============================
// Display history
// ===============================

function displayHistory() {

    const history =
        JSON.parse(localStorage.getItem("calculatorHistory")) || [];

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML =
            '<p class="empty">No calculations yet</p>';

        return;
    }

    history.forEach((item, index) => {

        const div = document.createElement("div");

        div.className = "history-item";

        div.innerHTML = `
            <div class="expression">
                ${item.expression}
            </div>

            <div class="result">
                = ${item.result}
            </div>
        `;

        div.addEventListener("click", () => {

            currentInput = String(item.result);

            shouldResetDisplay = false;

            updateDisplay();

        });

        historyList.appendChild(div);

    });

}


// ===============================
// Clear history
// ===============================

clearHistoryBtn.addEventListener("click", () => {

    localStorage.removeItem("calculatorHistory");

    displayHistory();

});


// ===============================
// Dark / Light mode
// ===============================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const darkMode =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "calculatorTheme",
        darkMode ? "dark" : "light"
    );

    themeBtn.textContent =
        darkMode ? "🌙" : "☀️";

});


// ===============================
// Load saved theme
// ===============================

function loadTheme() {

    const savedTheme =
        localStorage.getItem("calculatorTheme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent = "🌙";

    }

}


// ===============================
// Keyboard support
// ===============================

document.addEventListener("keydown", event => {

    const key = event.key;

    if (
        "0123456789.".includes(key)
    ) {
        enterNumber(key);
    }

    else if (
        ["+", "-", "*", "/", "%"].includes(key)
    ) {
        chooseOperator(key);
    }

    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }

    else if (key === "Backspace") {
        backspace();
    }

    else if (key === "Escape") {
        clearCalculator();
    }

});


// ===============================
// Reset calculator
// ===============================

function resetCalculator() {

    currentInput = "";
    previousInput = "";
    operator = null;
    shouldResetDisplay = true;

    previousDisplay.textContent = "";

}


// ===============================
// Start application
// ===============================

loadTheme();
displayHistory();
updateDisplay();