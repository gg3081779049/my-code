let board = document.getElementById("board");
let container = document.getElementById("container");
let panel = document.getElementById("panel");
let cup1 = document.getElementById("cup1");
let cup2 = document.getElementById("cup2");
let cup3 = document.getElementById("cup3");
let ball = document.getElementById("ball");
let shadow = document.getElementById("shadow");
let pause = document.getElementById("pause");

let len = 6;
let n = 12;
let v = 12;
let x = 2;
let originalPositions = {
    1: [panel.clientWidth / 2 - 120, panel.clientHeight / 2],
    2: [panel.clientWidth / 2, panel.clientHeight / 2],
    3: [panel.clientWidth / 2 + 120, panel.clientHeight / 2],
}

cup1.style.left = originalPositions[1][0] + "px";
cup1.style.top = originalPositions[1][1] + "px";
cup2.style.left = originalPositions[2][0] + "px";
cup2.style.top = originalPositions[2][1] + "px";
cup3.style.left = originalPositions[3][0] + "px";
cup3.style.top = originalPositions[3][1] + "px";
board.style.width = 80 + len * 64 + "px";

for (let i = 0; i < len; i++) {
    let hole = document.createElement("div");
    hole.className = "hole";
    container.appendChild(hole);
    let hole_ball = document.createElement("img");
    hole_ball.className = "hole_ball";
    hole.appendChild(hole_ball);
}

let flag = false;
let timer = setTimeout(() => {
    pause.onclick = () => {
        document.getElementById("pause").style.display = "none";
        panel.style.filter = "grayscale(0)";
        panel.onclick = false;
        open(cup2);
        play(1800).then(() => {
            ball.style.left = originalPositions[x][0] + "px";
            ball.style.display = "inline-block";
            shadow.style.left = originalPositions[x][0] + "px";
            shadow.style.display = "inline-block";
            flag = true;
        });
    }
}, 800);

for (const cup of panel.getElementsByClassName("cup")) {
    let length = len;
    cup.onclick = () => {
        if (flag) {
            flag = false;
            open(document.getElementById("cup" + x));
            let hole_balls = document.getElementsByClassName("hole_ball");
            if (cup.id !== "cup" + x) {
                open(cup);
                if (len < length) len++;
                hole_balls[length - len].style.opacity = "0";
            } else {
                hole_balls[length - len].style.opacity = "1";
                if (len > 1) {
                    len--;
                } else {
                    board.style.top = "-23%";
                    return false;
                }
            }
            play(1800).then(() => {
                ball.style.left = originalPositions[x][0] + "px";
                ball.style.display = "inline-block";
                shadow.style.left = originalPositions[x][0] + "px";
                shadow.style.display = "inline-block";
                flag = true;
            });


        }
    }
}
async function play(t) {
    await new Promise((s) => setTimeout(s, t));
    ball.style.display = "none";
    shadow.style.display = "none";
    for (const a of [...new Array(n)].map(() => {
        let n1 = Math.floor(Math.random() * 3) + 1;
        let n2 = Math.floor(Math.random() * 2) + 1;
        if (n1 === n2) n2++;
        x = x === n1 ? n2 : x === n2 ? n1 : x;
        return [n1, n2];
    })) {
        shell(...a);
        await new Promise(s => setTimeout(s, 1800 / v + 30));
    }
}

function open(cup) {
    cup.style.transition = "0.8s";
    cup.style.top = cup.offsetTop - 60 + "px";
    setTimeout(() => cup.style.top = originalPositions[cup.id.charAt(cup.id.length - 1)][1] + "px", 800);
}

function shell(n1, n2) {
    if (!/^[123]$/.test(n1) || !/^[123]$/.test(n2) || n1 === n2) return;
    let cup_1 = document.getElementById("cup" + n1);
    let cup_2 = document.getElementById("cup" + n2);
    let a = Math.abs(n1 - n2) > 1 ? 120 : 60;
    let b = Math.abs(n1 - n2) > 1 ? 50 : 30;
    let $ = n1 > n2 ? 1 : -1;
    move(a, b, $, cup_1, 90 * ($ - 1), 90 * (1 + $), () => {
        cup_1.style.left = originalPositions[n2][0] + "px";
        cup_1.style.top = originalPositions[n2][1] + "px";
        cup_1.style.zIndex = "0";
    });
    move(a, b, $, cup_2, -90 * ($ + 1), 90 * (1 - $), () => {
        cup_2.style.left = originalPositions[n1][0] + "px";
        cup_2.style.top = originalPositions[n1][1] + "px";
        cup_2.style.zIndex = "0";
    });
    cup_1.style.zIndex = "-1";
    cup_2.style.zIndex = "1";
    cup_1.id = "cup" + n2;
    cup_2.id = "cup" + n1;
}

function move(a, b, $, obj, n1, n2, gn) {
    obj.style.transition = "10ms";
    let n = n1;
    let x0 = obj.offsetLeft - a * Math.cos(n1 * Math.PI / 180);
    let y0 = obj.offsetTop + $ * b * Math.sin(n1 * Math.PI / 180);
    let timer = setInterval(() => {
        obj.style.left = `${x0 + a * Math.cos(n * Math.PI / 180)}px`;
        obj.style.top = `${y0 - $ * b * Math.sin(n * Math.PI / 180)}px`;
        n2 > n ? n += v : clearInterval(timer) & gn();
    }, 10);
}