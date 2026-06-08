const search = document.querySelector("#search");
const addForm = document.querySelector("#addForm");
const taskFrame = document.querySelector("#taskFrame");
let taskList = []
function inputTask(event) {
    event.preventDefault();
    let info = String(event.target.inpTask.value).trim();
    if (info.length === 0) {
        return;
    } else {
        taskList.push([info, false]);
        RenderTask(taskList);
    }
}
function Search() {
    let searchTarget = String(search.value).trim();
    if (searchTarget.length === 0) {
        RenderTask(taskList);
    } else {
        taskFrame.replaceChildren();
        let temp = taskList.filter((task) => {
            return String(task[0]).toLowerCase().includes(searchTarget.toLocaleLowerCase());
        });
        console.log(temp);
        RenderTask(temp);
    }
}
function RenderTask(Tasks) {
    taskFrame.replaceChildren();
    Tasks.forEach((task, index) => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("border", "rounded", "d-flex", "p-3", "justify-content-between", "mb-3");

        const taskForm = document.createElement("form");
        const Checkbox = document.createElement("input");
        Checkbox.type = "checkbox";
        Checkbox.classList.add("form-check-input");
        Checkbox.addEventListener("change", (event) => { task[1] = event.target.checked; });
        Checkbox.checked = task[1];
        const labTask = document.createElement("label");
        labTask.textContent = task[0];
        labTask.classList.add("form-check-label", "ms-1");
        taskForm.append(Checkbox, labTask);

        const btnClose = document.createElement("button");
        btnClose.classList.add("btn", "btn-close");
        btnClose.addEventListener("click", () => { RemoveTask(index) });
        taskCard.append(taskForm, btnClose);
        taskFrame.append(taskCard);
    });
}
function RemoveTask(index) {
    taskList.splice(index, 1);
    RenderTask(taskList);
}
function main() {
    addForm.addEventListener("submit", inputTask);
    search.addEventListener("input", Search);
}
main();