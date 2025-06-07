// loading tasks from local storage
function loadTasks() {
    let list = JSON.parse(window.localStorage.getItem("tasks")) || [];
    return list;
}

//saving tasks to local storage
function saveTasks(list) {
    window.localStorage.setItem("tasks", JSON.stringify(list));
}

//to render the page on reload
function renderTask(task, list, container) {
    if (!container) {
        console.error("Error: #tasks element not found!");
        return;
    }
    let div = document.createElement("div");
    div.innerHTML = `
        <span> ${task} </span>
        <input type = "button" class = "delete_button">
    `
    div.className = "tasks";
    let delete_button = div.querySelector(".delete_button");
    delete_button.value = "Delete"
    delete_button.onclick = function () {
        const index = list.indexOf(task);
        if (index !== -1) {
            list.splice(index, 1);
            saveTasks(list);
            div.remove();
        }
    }
    container.append(div);
}

//add task button functionality
let list = loadTasks();
let container = document.getElementById("tasks_container");
let textField = document.getElementById("text_field");
let button = document.getElementById("add_button");
list.forEach(element => {
    renderTask(element, list, container);
});
button.onclick = function () {
    if (textField.value) {
        list.push(textField.value);
        saveTasks(list);
        renderTask(textField.value, list, container);
        textField.value = "";
    }
}