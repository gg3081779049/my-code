let n = 3;
let len = 10;
let x0 = 800;
let y0 = 400;
let interval = 400;
let bgm1 = [[30, 30, 30], [0, 0, 0]];
let bgm2 = [[60, 60, 180], [10, 10, 10]];

let body = document.body;
let panel = document.getElementById("panel");
let text = document.getElementById("text");
let tip = document.getElementById("tip");
let o = document.getElementById("o");

o.style.left = x0 + "px";
o.style.top = y0 + "px";
body.style.background = "url('img/stars.png') 100%/100%,radial-gradient(circle at " + o.getBoundingClientRect().left + "px " + o.getBoundingClientRect().top + "px, rgb(" + bgm1[0] + "),rgb(" + bgm1[1] + "))";

let rgb = [...new Array(bgm1.length)].map((k, i) => [...new Array(bgm1[i].length)]);
let flag = true;
let index = 0;
let code = getCode(len);
for (let i = 0; i < len; i++) {
    let span = document.createElement("span");
    span.className = "before";
    span.innerText = code.charAt(i);
    tip.appendChild(span);
}

o.onclick = () => {
    if (flag) {
        flag = false;
        setTimeout(() => flag = true, interval * (n - 1));
        if (index) {
            wrong();
        } else {
            changeColor(index + 1);
            right();
        }
    }
}

function right() {
    index++;
    let num = 0;
    let timer = setInterval(() => {
        if (num < n) {
            let circle = document.createElement("img");
            panel.appendChild(circle);
            circle.src = "img/circle.png";
            circle.className = "circle";
            circle.style.left = Math.floor(Math.random() * (panel.offsetWidth - 80 + 1)) + "px";
            circle.style.top = Math.floor(Math.random() * (panel.offsetHeight - 80 + 1)) + "px";
            circle.style.transition = interval + "ms";
            circle.i = index;
            circle.j = ++num;
            circle.onclick = () => {
                if (flag) {
                    flag = false;
                    let signal = setTimeout(() => flag = true, interval * (n - 1));
                    if (circle.i === index && code.charAt(index - 1) === circle.j + "") {
                        changeColor(index + 1);
                        if (index >= len) {
                            clearTimeout(signal);
                            // console.log("通关成功");
                            text.innerHTML = "╰⊱⋋恭喜你通关~~⋌⊰╯";
                            text.style.color = "rgb(0, 168, 0)";
                            text.style.textShadow = "0 0 6px black";
                            wrong();
                        } else {
                            changeTip(index);
                            right();
                        }
                    } else {
                        index = 0;
                        changeColor(index);
                        changeTip(index);
                        wrong();
                    }
                }
            }
        } else {
            clearInterval(timer);
        }
    }, interval);
}

function wrong() {
    code = getCode(len);
    let spans = tip.getElementsByTagName("span");
    for (let i = 0; i < spans.length; i++) spans[i].innerText = code.charAt(i);
    for (const circle of document.getElementsByClassName("circle")) {
        circle.style.left = x0 + "px";
        circle.style.top = y0 + "px";
        setTimeout(() => circle.remove(), interval);
    }
}

function getCode(len) {
    let code = "";
    for (let i = 0; i < len; i++) code += Math.floor(Math.random() * n) + 1;
    return code;
}

function changeColor(k) {
    let x = o.getBoundingClientRect().left;
    let y = o.getBoundingClientRect().top;
    for (let i = 0; i < rgb.length; i++) {
        for (let j = 0; j < rgb[i].length; j++) {
            rgb[i][j] = bgm1[i][j] + Math.abs(bgm1[i][j] - bgm2[i][j]) * Math.min(k, len + 1) / (len + 1);
            body.style.background = "url('img/stars.png') 100%/100%,radial-gradient(circle at " + x + "px " + y + "px, rgb(" + rgb[0] + "),rgb(" + rgb[1] + "))";
        }
    }
}

function changeTip(k) {
    let spans = tip.getElementsByTagName("span");
    for (let i = 0; i < spans.length; i++) spans[i].className = i > k - 1 ? "before" : "after";
}