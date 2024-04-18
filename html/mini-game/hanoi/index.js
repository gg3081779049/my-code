let k = new URLSearchParams(window.location.search).get("k") + 7;

let panel = document.getElementById("panel");
let start = document.getElementById("start");
let trans = document.getElementById("trans");
let target = document.getElementById("target");

let min_width = panel.clientWidth * 0.1;
let max_width = panel.clientWidth * 0.3;

let select = null;

for (let i = k; i > 0; i--) {
    let disc = document.createElement("div");
    disc.len = i;
    disc.className = "disc";
    disc.style.width = `${max_width - (k - i) * (max_width - min_width) / (k - 1)}px`;
    disc.style.height = `${panel.clientHeight / k}px`;
    start.appendChild(disc);
}

window.onclick = (e) => {
    if (select) select.classList.remove("disc-focus");
    if (e.target.className === "disc" && e.target.parentNode.lastChild == e.target) {
        select = e.target;
        select.classList.add("disc-focus");
    } else if (e.target.className === "column" && select) {
        let last = e.target.lastElementChild;
        if (!last || last.len > select.len) e.target.appendChild(select);
        select = null;
    } else {
        select = null;
    }
}

target.onclick = () => {
    if (target.children.length !== k - 1) return;
    console.log("Done");
    let discs = document.getElementsByClassName("disc");
    for (const disc of discs) disc.onclick = false;
}

document.getElementById("help").onclick = () => {
    for (const o of getHelp()) console.log(o[0] + " -> " + o[1]);
}

function getHelp() {
    let arr = [...new Array(start.children.length)].map((_, i) => start.children[i].len);
    let brr = [...new Array(trans.children.length)].map((_, i) => trans.children[i].len);
    let crr = [...new Array(target.children.length)].map((_, i) => target.children[i].len);
    let order = new Array();
    [arr.name, brr.name, crr.name] = [1, 2, 3];
    moveDisks(arr.length, arr, crr, brr);
    function moveDisks(n, start, target, trans) {
        if (n === 1) {
            target.push(start.pop());
            order.push([start.name, target.name]);
        } else {
            moveDisks(n - 1, start, trans, target);
            moveDisks(1, start, target, trans);
            moveDisks(n - 1, trans, target, start);
        }
    }
    return order;
}

async function execute(order, ms) {
    let tower = {
        1: start,
        2: trans,
        3: target,
    };
    for (const o of order) {
        tower[o[0]].lastChild.click();
        tower[o[1]].click();
        await new Promise(resolve => setTimeout(resolve, ms));
    }
}