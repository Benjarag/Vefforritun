let result;

const evaluateResult = () => {
  var userInput = document.getElementById("mathIn").value; // Get the value from the input field
  if (userInput === String(result)) { // Check if the user input is equal to the result
    document.getElementById("resultMsg").style = "display: block;"; // Display the result message
    document.getElementById("resultMsg").className = "alert alert-success"; // Set the class to alert-success
    document.getElementById("resultMsg").textContent = "correct"; // Set the text content to correct
  } else {
    document.getElementById("resultMsg").style = "display: block;"; // Display the result message
    document.getElementById("resultMsg").className = "alert alert-danger"; // Set the class to alert-danger
    document.getElementById("resultMsg").textContent = "incorrect"; // Set the text content to incorrect
  }

  setTimeout(() => { // Set a timeout to clear the result message and input field
    document.getElementById("resultMsg").textContent = ""; // Clear the text content
    document.getElementById("resultMsg").style = "display:none;"; // Hide the result message
    document.getElementById("mathIn").value = ""; // Clear the input field
    newMathTask(); // Generate a new math task
  }, 5000); // Set the timeout to 5 seconds
};

const printLoop = () => { // Function to print the loop
  document.getElementById("loopOutput").innerHTML = ""; // Clear the loop output
  const number = document.getElementById("loopNumber").value; // Get the value from the input field

  for (let i = 1; i <= number; i++) { // Loop from 1 to the number
    if (i < number) { // Check if the current number is less than the number
      printSingleLine(i, true); // Print the current number with a new line
    } else {
      printSingleLine(i, false); // Print the current number without a new line
    }
  }
};

const printSingleLine = (i, newLine) => {
  setTimeout(() => { // Set a timeout to print the number
    document.getElementById("loopOutput").innerHTML =
      document.getElementById("loopOutput").innerHTML + i; 
      // document meaning the whole page, 
      // getElementById meaning get the element by its id,
      // loopoutput is the id of the element, 
      // innerHTML is the content of the element
      // then the main functionality is the i which is the number
    if (newLine) {
      document.getElementById("loopOutput").innerHTML =
        document.getElementById("loopOutput").innerHTML + "<br>";
        // <br> is a line break or new line
    }
  }, 10); // Set the timeout to 10 milliseconds or 0.01 seconds
};

const newMathTask = () => { // Function to generate a new math task
  let num1 = Math.floor(Math.random() * 10) + 1; // Generate a random number between 1 and 10
  let num2 = Math.floor(Math.random() * 10) + 1; // Generate a random number between 1 and 10
  let temp; // Temporary variable to swap the numbers

  const op = Math.floor(Math.random() * 3) + 1; // Generate a random number between 1 and 3
  const taskField = document.getElementById("taskMsg"); // Get the task message element

  //Swap if needed
  if (num1 < num2) {
    temp = num1;
    num1 = num2;
    num2 = temp;
  }

  // Check the operation
  // 1 = addition, 2 = subtraction, 3 = multiplication, this is like this because of the random number generated
  // we could of have made it a different way like 1 = subtraction, 2 = addition, 3 = multiplication
  // but this is the way we are doing it
  if (op === 1) { // Check if the operation is addition
    taskField.textContent = "Calculate " + num1 + " + " + num2; // Set the task message to addition
    result = num1 + num2; // Calculate the result
  } else if (op === 2) { // Check if the operation is subtraction
    taskField.textContent = "Calculate " + num1 + " - " + num2; // Set the task message to subtraction
    result = num1 - num2; // Calculate the result
  } else { // If the operation is not addition or subtraction, it must be multiplication
    taskField.textContent = "Calculate " + num1 + " * " + num2; // Set the task message to multiplication
    result = num1 * num2; // Calculate the result
  }
};

newMathTask(); // Generate a new math task
