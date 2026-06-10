const search = document.querySelector("#search");
const addForm = document.querySelector("#addForm");
const taskFrame = document.querySelector("#taskFrame");
const labActive = document.querySelector("#labActive");
const labComplete = document.querySelector("#labComplete");
const labAll = document.querySelector("#labAll");
const actFilter = document.querySelector("#Active");
const completeFilter = document.querySelector("#Complete");
const priorityFilter = document.querySelector("#Priority");
let filterMode = "all";
let taskList = []

function inputTask(event) {
    event.preventDefault();
    let info = String(event.target.inpTask.value).trim();
    if (info.length === 0) {
        return;
    } else {
        taskList.push({
            id: Date.now(),
            Name: info,
            Status: false,
        });
        SaveTask();
        RenderTaskCount();
        Search();
    }
    event.target.inpTask.value = "";
}
function filterEvent(filterMode) {
    if (filterMode === "active") {
        completeFilter.checked = false;
        return taskList.filter(task => !task.Status);
    } else if (filterMode === "complete") {
        actFilter.checked = false;
        return taskList.filter(task => task.Status);
    }
    return taskList;
}
function ReadTask() {
    let data = localStorage.getItem("taskList");
    if (data) {
        taskList = JSON.parse(data);
    }
}
function SaveTask() {
    localStorage.setItem("taskList", JSON.stringify(taskList));
}
function RenderTaskCount() {
    let active = taskList.filter(task => !task.Status).length;
    let complete = taskList.filter(task => task.Status).length;
    let allTask = taskList.length;
    labActive.textContent = active;
    labComplete.textContent = complete;
    labAll.textContent = allTask;
}
function Search() {
    let searchTarget = String(search.value).trim().toLowerCase();
    let tasks = filterEvent(filterMode);
    if (searchTarget.length === 0) {
        RenderTask(tasks);
    } else {
        let temp = tasks.filter((task) => {
            return String(task.Name).toLowerCase().includes(searchTarget.toLocaleLowerCase());
        });
        RenderTask(temp);
    }
}
function CheckboxEvent(event, task) {
    task.Status = event.target.checked;
    SaveTask();
    RenderTaskCount();
    Search();
}
function RenderTask(Tasks) {
    taskFrame.replaceChildren();
    Tasks.forEach((task) => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("border", "rounded", "d-flex", "p-2", "justify-content-between", "align-items-center", "mb-3");

        const taskForm = document.createElement("form");
        const Checkbox = document.createElement("input");
        Checkbox.type = "checkbox";
        Checkbox.classList.add("form-check-input");
        Checkbox.addEventListener("change", (event) => { CheckboxEvent(event, task) });
        Checkbox.checked = task.Status;
        const labTask = document.createElement("label");
        labTask.textContent = task.Name;
        labTask.classList.add("form-check-label", "ms-1");
        taskForm.append(Checkbox, labTask);

        const btnClose = document.createElement("button");
        btnClose.classList.add("btn","btn-danger", "material-symbols-outlined");
        btnClose.textContent = "delete";
        btnClose.addEventListener("click", () => { RemoveTask(task) });
        taskCard.append(taskForm, btnClose);
        taskFrame.append(taskCard);
    });
}
function RemoveTask(target) {
    taskList = taskList.filter((task) => {
        return task.id !== target.id;
    });
    SaveTask();
    RenderTaskCount();
    Search();
}
function main() {
    addForm.addEventListener("submit", inputTask);
    search.addEventListener("input", Search);
    actFilter.addEventListener("change", () => {
        if (actFilter.checked) {
            filterMode = "active"
        } else {
            filterMode = "all"
        }
        Search();
    });
    completeFilter.addEventListener("change", () => {
        if (completeFilter.checked) {
            filterMode = "complete"
        } else {
            filterMode = "all"
        }
        Search();
    });
    priorityFilter.addEventListener("change", () => {
        if (priorityFilter.checked) {
            filterMode = "priority"
        } else {
            filterMode = "all"
        }
        Search();
    });
    ReadTask();
    Search();
    RenderTaskCount();
}
main();