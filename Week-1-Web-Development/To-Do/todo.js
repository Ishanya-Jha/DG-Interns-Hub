// Find the input field.
let taskInput = document.getElementById("taskInput");

// Find the Add Task button.
let addTaskButton = document.getElementById("addTaskButton");

// Find the task list.
let taskList = document.getElementById("taskList");

// Run the function when the Add Task button is clicked.
addTaskButton.addEventListener("click", function() {

    // Get the text entered by the user.
    let taskText = taskInput.value;

    // Stop if the input is empty.
    if (taskText.trim() === "") {
        return;
    }

    // Create a new list item.
    let taskItem = document.createElement("li");

    // Add the task text to the list item.
    taskItem.textContent = taskText;

    // Add the new task to the task list.
    taskList.appendChild(taskItem);

    // Clear the input after adding the task.
    taskInput.value = "";

});