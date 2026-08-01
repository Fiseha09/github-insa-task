const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const totalEl = document.getElementById("total");
const completedEl = document.getElementById("completed");
const remainingEl = document.getElementById("remaining");

let tasks = JSON.parse(localStorage.getItem("studentTasks") || "[]");

function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const remaining = total - completed;

    totalEl.textContent = total;
    completedEl.textContent = completed;
    remainingEl.textContent = remaining;
}

function renderTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one to get started.</li>';
        updateStats();
        return;
    }

    taskList.innerHTML = tasks
        .map((task) => {
            const checked = task.completed ? "checked" : "";
            return `
                <li class="task-item ${task.completed ? "completed" : ""}">
                    <div class="task-main">
                        <input
                            class="task-checkbox"
                            type="checkbox"
                            data-id="${task.id}"
                            ${checked}
                        >
                        <span class="task-text">${task.text}</span>
                    </div>
                    <div class="task-actions">
                        <button class="delete-btn" type="button" data-id="${task.id}">Delete</button>
                    </div>
                </li>
            `;
        })
        .join("");

    updateStats();
}

function addTask(text) {
    const trimmedText = text.trim();

    if (!trimmedText) {
        taskInput.focus();
        return;
    }

    tasks.unshift({
        id: Date.now(),
        text: trimmedText,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
}

function toggleTask(id) {
    tasks = tasks.map((task) => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}


taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask(taskInput.value);
});

taskList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-btn");
    if (deleteButton) {
        deleteTask(Number(deleteButton.dataset.id));
        return;
    }

    const checkbox = event.target.closest(".task-checkbox");
    if (checkbox) {
        toggleTask(Number(checkbox.dataset.id));
    }
});

renderTasks();
