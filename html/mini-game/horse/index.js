let n = 5, m = 5;
let x = 2, y = 2;

let table = document.getElementById("table");
let horse = document.getElementById("horse");

let w = table.clientWidth / m;
let h = table.clientHeight / n;
let colors = [["hsl(124, 53%, 35%)", "hsl(122, 54%, 54%)"], ["black", "white"]];

horse.style.width = w + "px";
horse.style.height = h + "px";
horse.style.left = y * w + "px";
horse.style.top = x * h + "px";
horse.style.filter = "hue-rotate(" + (124 + 122 - 246) / 2 + "deg)";
table.style.gridTemplate = "repeat(" + n + ",1fr)/repeat(" + m + ",1fr)";

for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.status = false;
        cell.i = i;
        cell.j = j;
        cell.style.background = colors[Number(!cell.status)][(cell.i + cell.j) & 1];
        cell.style.width = w + "px";
        cell.style.height = h + "px";
        cell.style.transition = "600ms";
        table.appendChild(cell);
        cell.onclick = function () {
            if ((this.i - x) ** 2 + (this.j - y) ** 2 === 5) {
                horse.style.left = this.offsetLeft + "px";
                horse.style.top = this.offsetTop + "px";
                this.style.background = colors[Number(this.status)][(this.i + this.j) & 1];
                this.status = !this.status;
                x = this.i;
                y = this.j;
            }
        }
    }
}

table.onclick = function () {
    let cells = this.getElementsByClassName("cell");
    for (const cell of document.getElementsByClassName("cell")) if (!cell.status) return false;
    for (const cell of cells) cell.onclick = false;
    // console.log("通关成功");
    setTimeout(() => horse.style.opacity = 0, 500);
}