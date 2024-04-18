let w = 3;
let h = 7;

let table = document.getElementById("table");
let panel = document.getElementById("panel");

let _chess = null;
for (let i = 0; i < h; i++) {
    for (let j = 0; j < h; j++) {
        if (!overstep(i, j)) {
            let hole = document.createElement("div");
            hole.className = "hole";
            hole.i = i;
            hole.j = j;
            hole.isNull = false;
            hole.style.zIndex = "0";
            hole.style.width = panel.offsetWidth / h + "px";
            hole.style.height = panel.offsetHeight / h + "px";
            hole.style.left = hole.j * panel.offsetWidth / h + "px";
            hole.style.top = hole.i * panel.offsetHeight / h + "px";
            panel.appendChild(hole);
            let chess = document.createElement("div");
            chess.className = "chess";
            chess.tabIndex = 0;
            chess.i = i;
            chess.j = j;
            chess.style.zIndex = "1";
            chess.style.width = panel.offsetWidth / h + "px";
            chess.style.height = panel.offsetHeight / h + "px";
            chess.style.left = chess.j * panel.offsetWidth / h + "px";
            chess.style.top = chess.i * panel.offsetHeight / h + "px";
            panel.appendChild(chess);
            panel.onclick = (e) => {
                if (e.target.className === "chess") {
                    _chess = e.target;
                    table.style.cursor = "url('img/clamp.png') 5 40, pointer";
                } else if (e.target.className === "hole" && e.target.isNull && Math.hypot(_chess.i - e.target.i, _chess.j - e.target.j) === 2) {
                    if (!takeOff((_chess.i + e.target.i) / 2, (_chess.j + e.target.j) / 2)) return;
                    for (const hole of panel.getElementsByClassName("hole")) if (hole.i === _chess.i && hole.j === _chess.j) hole.isNull = true;
                    e.target.isNull = false;
                    _chess.i = e.target.i;
                    _chess.j = e.target.j;
                    _chess.style.left = _chess.j * panel.offsetWidth / h + "px";
                    _chess.style.top = _chess.i * panel.offsetHeight / h + "px";
                    _chess = null;
                    table.style.cursor = "url('img/release.png') 5 40, pointer";
                } else {
                    _chess = null;
                    table.style.cursor = "url('img/release.png') 5 40, pointer";
                }
            }
        }
    }
}

// 去掉中间的棋子
takeOff(~~(h / 2), ~~(h / 2));

function takeOff(i, j) {
    let holes = panel.getElementsByClassName("hole");
    let chesses = panel.getElementsByClassName("chess");
    for (const chess of chesses) if (chess.i === i && chess.j === j) chess.style.animation = "takeOff 0.6s forwards";
    for (const hole of holes) if (hole.i === i && hole.j === j) return hole.isNull ? false : hole.isNull = true;
}

function overstep(n, m) {
    let p1 = 2 * n < h - w;
    let p2 = 2 * n >= h + w;
    let q1 = 2 * m < h - w;
    let q2 = 2 * m >= h + w;
    return p1 && q1 || p1 && q2 || p2 && q1 || p2 && q2;
}