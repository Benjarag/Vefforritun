let result;

const evaluateResult = () => {
  var userInput = document.getElementById("mathIn").value;
  if (userInput === String(result)) {
    document.getElementById("resultMsg").style = "display: block;";
    document.getElementById("resultMsg").className = "alert alert-success";
    document.getElementById("resultMsg").textContent = "correct";
  } else {
    document.getElementById("resultMsg").style = "display: block;";
    document.getElementById("resultMsg").className = "alert alert-danger";
    document.getElementById("resultMsg").textContent = "incorrect";
  }

  setTimeout(() => {
    document.getElementById("resultMsg").textContent = "";
    document.getElementById("resultMsg").style = "display:none;";
    document.getElementById("mathIn").value = "";
    newMathTask();
  }, 5000);
};

const printLoop = () => {
  document.getElementById("loopOutput").innerHTML = "";
  const number = document.getElementById("loopNumber").value;

  for (let i = 1; i <= number; i++) {
    if (i < number) {
      printSingleLine(i, true);
    } else {
      printSingleLine(i, false);
    }
  }
};

const printSingleLine = (i, newLine) => {
  setTimeout(() => {
    document.getElementById("loopOutput").innerHTML =
      document.getElementById("loopOutput").innerHTML + i;
    if (newLine) {
      document.getElementById("loopOutput").innerHTML =
        document.getElementById("loopOutput").innerHTML + "<br>";
    }
  }, 10);
};

const newMathTask = () => {
  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  let temp;

  const op = Math.floor(Math.random() * 3) + 1;
  const taskField = document.getElementById("taskMsg");

  //Swap if needed
  if (num1 < num2) {
    temp = num1;
    num1 = num2;
    num2 = temp;
  }

  if (op === 1) {
    taskField.textContent = "Calculate " + num1 + " + " + num2;
    result = num1 + num2;
  } else if (op === 2) {
    taskField.textContent = "Calculate " + num1 + " - " + num2;
    result = num1 - num2;
  } else {
    taskField.textContent = "Calculate " + num1 + " * " + num2;
    result = num1 * num2;
  }
};

newMathTask();
