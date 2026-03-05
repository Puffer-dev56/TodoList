const output = document.querySelector(".output");
const commit = document.querySelector("button");
const input = document.querySelector("input");
commit.addEventListener("click",()=>{
    const newElement = document.createElement("div");
    newElement.classList.add("todo");


    const h3 = document.createElement("h3");
    h3.innerText = "- " + input.value


    const remove = document.createElement("button");
    remove.innerText = "delete"
    remove.addEventListener("click",(event)=>{
        event.target.parentNode.remove();
    });

    newElement.append(h3,remove);
    output.appendChild(newElement);
});
