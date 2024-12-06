import "./style.css"
document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");

  window.changetoOriginal =() => {
    body.style.backgroundColor = "#f0f0f0";
  }
   window.changetoRed =() => {
    body.style.backgroundColor = "#FF4938";
  }
  window.changetoBlue =() => {
    body.style.backgroundColor = "#1C6BFF";
  }
  window.changetoYellow =() => {
    body.style.backgroundColor = "#FFE387";
  }
  


  const display = document.getElementById("display");
  let expressionBuffer = "";
  let currentNumber = "";

  window.appendToDisplay = function (value) {
    if (!isNaN(value) || value === ".") {
      currentNumber += value;
      display.innerText = currentNumber;
    } else {
      if (currentNumber !== "") {
        expressionBuffer += currentNumber;
        currentNumber = "";
      }
      if (value === "-" && expressionBuffer === "") {
        currentNumber = "-";
        display.innerText = currentNumber;
      } else {
        expressionBuffer += value;
        display.innerText = expressionBuffer;
      }
    }
  };

  window.clearDisplay = function () {
    display.innerText = "0";
    expressionBuffer = "";
    currentNumber = "";
  };

  window.toggleSign = function () {
    if (currentNumber !== "") {
      currentNumber =
        currentNumber.startsWith("-") ? currentNumber.slice(1) : `-${currentNumber}`;
      display.innerText = currentNumber;
    }
  };
  window.calculateResult = function () {
    if (currentNumber !== "") {
      expressionBuffer += currentNumber;
    }
    try {
      const tokens = tokenizeExpression(expressionBuffer);
      let result = evaluateTokens(tokens);

      if (Math.abs(result) >= 1e10 || result.toString().length > 9) {
        result = parseFloat(result.toPrecision(5));
      }

      display.innerText = result;
      expressionBuffer = result.toString();
      currentNumber = "";
    } catch (error) {
      display.innerText = "Error";
      expressionBuffer = "";
      currentNumber = "";
    }
  };


  function tokenizeExpression(expression) {
    const tokens = [];
    let numberBuffer = "";

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if ("0123456789.".includes(char)) {
        numberBuffer += char;
      } else if (char === "-" && (tokens.length === 0 || isNaN(tokens[tokens.length - 1]))) {
        numberBuffer += char;
      } else {
        if (numberBuffer) {
          tokens.push(parseFloat(numberBuffer));
          numberBuffer = "";
        }
        tokens.push(char);
      }
    }

    if (numberBuffer) {
      tokens.push(parseFloat(numberBuffer));
    }

    return tokens;
  }

  function evaluateTokens(tokens) {
    const operators = {
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
      "*": (a, b) => a * b,
      "/": (a, b) => a / b,
      "%": (a, b) =>b * (a * 0.01)
    };

    const precedence = [["*", "/", "%"], ["+", "-"]];

    for (const ops of precedence) {
      for (let i = 0; i < tokens.length; i++) {
        if (ops.includes(tokens[i])) {
          const result = operators[tokens[i]](tokens[i - 1], tokens[i + 1]);
          tokens.splice(i - 1, 3, result);
          i -= 1;
        }
      }
    }

    if (tokens.length !== 1) {
      throw new Error("Invalid expression");
    }

    return tokens[0];
  }
});
