let A = [[2, 0, 0, 1, 0], [0, -1, 0, 0, 3], [1, 0, 1, 0, -1], [0, 0, -1, 1, 0], [2, 3, 0, 0, -2]];
let E = [3, -1, 0, 4, 3];

let panel = document.getElementById("panel");
for (let i = 0, w = panel.clientWidth, h = panel.clientHeight, n = E.length; i < n; i++) {
    let box = document.createElement("div");
    box.className = "box";
    box.style.width = w / n * (n - i) + "px";
    box.style.height = h / n * (n - i) + "px";
    box.style.backgroundSize = w + "px " + h + "px";
    box.style.backgroundPosition = i * w / n / -2 + "px " + i * h / n / -2 + "px";
    box.style.transform = "rotateZ(" + E[i] * 360 / n + "deg)";
    box.nth = i;
    panel.appendChild(box);
    box.onclick = () => {
        let boxes = panel.getElementsByClassName("box");
        for (let i = 0; i < E.length; i++) {
            E[i] += A[box.nth][i];
            boxes[i].style.transform = "rotateZ(" + E[i] * 360 / n + "deg)";
        }
    }
}

panel.onclick = function () {
    for (let i = 0; i < E.length; i++) if (E[i] % E.length !== 0) return false;
    // console.log("%c通关成功", "color:#008000");
    let boxes = panel.getElementsByClassName("box");
    for (const box of boxes) box.onclick = false;
}

document.getElementById("help").onclick = () => {
    let key = math.multiply(math.matrix(E.map(i => - i % E.length)), math.inv(A))._data;
    for (let i = 0; i < key.length; i++) key[i] = ((Number.isInteger(key[i]) ? key[i] : Math.round(key[i])) % E.length + E.length) % E.length;
    console.log("%c" + key, "color: #2bd4cb");
}