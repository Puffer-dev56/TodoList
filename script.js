const search = document.querySelector("#search");
const addForm = document.querySelector("#addForm");
const taskFrame = document.querySelector("#taskFrame");
const labActive = document.querySelector("#labActive");
const labComplete = document.querySelector("#labComplete");
const labAll = document.querySelector("#labAll");
const actFilter = document.querySelector("#Active");
const completeFilter = document.querySelector("#Complete");
const priorityFilter = document.querySelector("#Priority");
const inpStarttime = document.querySelector("#from");
let taskList = [];
function inputTask(event) {
    event.preventDefault();
    let info = String(event.target.inpTask.value).trim();
    let inpPriority = String(event.target.PrioritySelector.value);
    let inpFrom = String(event.target.from.value);
    let inpDeadline = String(event.target.deadline.value);
    let checkDate = new Date(inpDeadline) - new Date(inpFrom);
    if (info.length === 0) {
        event.target.inpTask.focus();
        return;
    } else if (inpFrom.length === 0) {
        event.target.from.focus();
        return;
    } else if (inpDeadline.length === 0) {
        event.target.deadline.focus();
        return;
    } else if (checkDate < 0) {
        setInpStarttime();
        event.target.deadline.value = "";
        event.target.from.focus();
        return;
    } else {
        taskList.push({
            id: Date.now(),
            Name: info,
            Status: false,
            Priority: inpPriority,
            From: inpFrom,
            Deadline: inpDeadline,
        });
        event.target.inpTask.value = "";
        event.target.deadline.value = "";
        SaveTask();
        RenderTaskCount();
        Search();
        setInpStarttime();
    }
}
function filterEvent() {
    if (actFilter.checked) {
        completeFilter.checked = false;
        return taskList.filter(task => !task.Status);
    } else if (completeFilter.checked) {
        actFilter.checked = false;
        return taskList.filter(task => task.Status);
    } else if (priorityFilter.checked) {
        return [...taskList].sort((a, b) => Number(b.Priority) - Number(a.Priority));
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
    let tasks = filterEvent();
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
function DateText(task) {
    let startTime = String(task.From).split("-");
    let endTime = String(task.Deadline).split("-");
    startTime = startTime[2] + "/" + startTime[1] + "/" + startTime[0];
    endTime = endTime[2] + "/" + endTime[1] + "/" + endTime[0];
    return startTime + " - " + endTime;
}
function PriorityText(task) {
    if (task.Priority === "1") {
        return ["Heigh", "bg-danger"];
    } else if (task.Priority === "2") {
        return ["Medium", "bg-warning"];
    } else {
        return ["Low", "bg-info"]
    }
}
function TasksChecked(taskCard, labDate, labTask, task) {
    if (task.Status) {
        taskCard.classList.add("opacity-75");
        labTask.classList.add("text-decoration-line-through", "text-secondary");
        labDate.classList.add("text-secondary");
    }
}
function RenderTask(Tasks) {
    taskFrame.replaceChildren();
    Tasks.forEach((task) => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("border", "rounded", "d-flex", "flex-column", "mb-3");

        const header = document.createElement("div");
        const body = document.createElement("div");
        body.classList.add("d-flex", "p-2", "justify-content-between", "align-items-center");
        header.classList.add("bg-light", "rounded-top", "d-flex", "position-relative", "align-items-center", "justify-content-center", "border-bottom", "py-2");
        taskCard.append(header, body);

        const labDate = document.createElement("p")
        const badge = document.createElement("span");
        badge.classList.add("badge", "position-absolute", "start-0", "ms-2", PriorityText(task)[1]);
        badge.textContent = PriorityText(task)[0];
        labDate.textContent = DateText(task);
        labDate.classList.add("m-0", "ms-4");
        header.append(badge, labDate);

        const taskForm = document.createElement("form");
        const Checkbox = document.createElement("input");
        Checkbox.addEventListener("change", (event) => { CheckboxEvent(event, task) });
        Checkbox.type = "checkbox";
        Checkbox.classList.add("form-check-input");
        Checkbox.checked = task.Status;
        const labTask = document.createElement("label");
        labTask.textContent = task.Name;
        labTask.classList.add("form-check-label", "ms-1");
        taskForm.append(Checkbox, labTask);

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("d-flex", "gap-2");
        body.append(taskForm, btnContainer);
        const btnClose = document.createElement("button");
        const btnEdit = document.createElement("button");
        btnClose.classList.add("btn", "btn-danger", "material-symbols-outlined");
        btnClose.textContent = "delete";
        btnEdit.classList.add("btn", "btn-outline-secondary", "material-symbols-outlined");
        btnEdit.textContent = "edit";
        btnClose.addEventListener("click", () => { DeleteModal(task); });
        btnEdit.addEventListener("click", () => { btnEditEvent(task) });
        btnContainer.append(btnEdit, btnClose);
        TasksChecked(taskCard, labDate, labTask, task);
        taskFrame.prepend(taskCard);
    });
}
function btnEditEvent(task) {
    const editModal = new bootstrap.Modal("#editModal");
    const editForm = document.querySelector("#editForm");
    const taskFrame = document.querySelector("#inpTaskFrame");
    editForm.inpCategory.value = task.Name;
    editForm.prioritySelector.value = task.Priority;
    editForm.from.value = task.From;
    editForm.to.value = task.Deadline;
    editForm.Add.onclick = () => { EditModal(taskFrame) }
    editForm.onsubmit = (e) => {
        e.preventDefault();
        SaveChange(task, editForm)
        editModal.hide();
    };
    editModal.show();
}
function EditModal(taskFrame) {
    const inpCard = document.createElement("div");
    const body = document.createElement("div");
    inpCard.classList = "d-flex align-items-center justify-content-between p-0 mb-2 gap-1"
    body.classList = "input-group";

    const labInp = document.createElement("label");
    const inpTask = document.createElement("input");
    labInp.classList = "input-group-text";
    labInp.textContent = "-"
    inpTask.classList = "form-control";
    inpTask.placeholder = "What are you focusing on...";
    inpTask.id = "subTask";
    body.append(labInp, inpTask);

    const btnDelete = document.createElement("button");
    btnDelete.classList = "btn btn-danger material-symbols-outlined"
    btnDelete.textContent = "delete"
    btnDelete.onclick = () => { RemoveSubTask(inpCard) }
    inpCard.append(body, btnDelete);
    taskFrame.append(inpCard);
}
function RemoveSubTask(inpCard) {
    inpCard.remove();
}
function DeleteModal(target) {
    const delModal = new bootstrap.Modal("#delModal");
    const btnDelete = document.querySelector("#delete");
    const btnCancel = document.querySelector("#cancel");
    btnDelete.onclick = () => {
        RemoveTask(target);
        delModal.hide();
    };
    btnCancel.onclick = () => { delModal.hide(); };
    delModal.show();
}
function SaveChange(task, editForm) {
    task.Name = editForm.inpCategory.value;
    task.Priority = editForm.prioritySelector.value;
    task.From = editForm.from.value
    task.Deadline = editForm.to.value
    Search();
}
function RemoveTask(target) {
    taskList = taskList.filter((task) => {
        return task.id !== target.id;
    });
    SaveTask();
    RenderTaskCount();
    Search();
}
function setInpStarttime() {
    let objDate = new Date();
    let year = objDate.getFullYear();
    let month = String(objDate.getMonth() + 1).padStart(2, "0");
    let date = String(objDate.getDate()).padStart(2, "0");
    inpStarttime.value = year + "-" + month + "-" + date;
}
function main() {
    addForm.addEventListener("submit", inputTask);
    search.addEventListener("input", Search);
    actFilter.addEventListener("change", Search);
    completeFilter.addEventListener("change", Search);
    priorityFilter.addEventListener("change", Search);
    ReadTask();
    Search();
    RenderTaskCount();
    setInpStarttime();
}
main();