/*//To find the calculator display in the HTML.
let display = document.getElementById("display");

//To show the element in the browser console.
console.log(display);

/*let button7 = document.getElementById("button-7");
//trial using 1st button
button7.addEventListener("click",function () {
    display.value ="7";
});

// Find all buttons that have class="number".
let numberButtons = document.querySelectorAll(".number");

// Add a click event to every number button.
numberButtons.forEach(function(button) {

    // When a number button is clicked,
    // add that button's number to the display.
    button.addEventListener("click", function() {
        display.value += button.textContent;
    });

});*/



//final Code

// Find the calculator display.
let display = document.getElementById("display");

// Find all buttons that have class="number".
let numberButtons = document.querySelectorAll(".number");

// Add a click event to every number button.
numberButtons.forEach(function(button) {

    // When a number button is clicked,
    // add that button's number to the display.
    button.addEventListener("click", function() {
        display.value += button.textContent;
    });

});

/* only 1 decimal per expression is working //improve
//to  find the decimal . button.
let decimalButton = document.getElementById("decimal");

// Add a click event to the decimal button.
decimalButton.addEventListener("click", function() {

    // Only add a decimal point if the current number doesn't already have one.
    if (!display.value.includes(".")) {
        display.value += ".";
    }

});*/

// Find the decimal button.
let decimalButton = document.getElementById("decimal");

// Add a click event to the decimal button.
decimalButton.addEventListener("click", function() {

    // Split the expression at the operators.
    let currentNumber = display.value.split(/[+\-*/]/).pop();

    // Add a decimal only if the current number doesn't already have one.
    if (!currentNumber.includes(".")) {
        display.value += ".";
    }

});

// Find the operator buttons.
let plusButton = document.getElementById("plus");
let subtractButton = document.getElementById("subtract");
let multiplyButton = document.getElementById("multiply");
let divideButton = document.getElementById("divide");

// Add the operators to the display when clicked.
plusButton.addEventListener("click", function() {
    display.value += "+";
});

subtractButton.addEventListener("click", function() {
    display.value += "-";
});

multiplyButton.addEventListener("click", function() {
    display.value += "*";
});

divideButton.addEventListener("click", function() {
    display.value += "/";
});
// Find the Clear button.
let clearButton = document.getElementById("clear");

// Clear everything from the display.
clearButton.addEventListener("click", function() {
    display.value = "";
});
// Find the equals button.
let equalsButton = document.getElementById("equals");

// Calculate the expression when = is clicked.
equalsButton.addEventListener("click", function() {
    display.value = eval(display.value);
});
