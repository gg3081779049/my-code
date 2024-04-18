let n = 6, m = 5;   // 行列
let kind = 23;      // 种类
let t = 200;        // 时间间隔
let time = 60;      // 挑战时间
let start = 5;      // 准备时间

let arr = [...new Array(n * m)].map((_, i) => i).sort(_ => Math.random() - 0.5).map(k => Math.floor(k / 2) % kind + 1);

let flag = false, _card = null, timer;
let countdown = document.getElementById("countdown");
let panel = document.getElementById('panel');
panel.style.gridTemplate = "repeat(" + n + ", 1fr) / repeat(" + m + ", 1fr)";
for (let i = 0; i < arr.length; i++) {
    let card = document.createElement('img');
    card.status = false;
    card.val = arr[i];
    card.className = "card";
    card.src = card.status ? "img/" + card.val + ".png" : "img/back.png";
    card.style.transition = t + "ms ease-in-out";
    panel.appendChild(card);
    card.onclick = function () {
        if (flag && !card.status) {
            flag = false;
            setTimeout(_ => flag = true, t);
            flip(card);
            setTimeout(() => {
                if (_card === null) {
                    _card = card;
                } else {
                    if (_card.val !== card.val) {
                        flip(_card);
                        flip(card);
                    } else {
                        _card.style.opacity = "0.1";
                        card.style.opacity = "0.1";
                    }
                    _card = null;
                }
            }, t * 2);
        }
    }
}

panel.style.width = panel.offsetWidth + "px";
panel.style.height = panel.offsetHeight + "px";
panel.onclick = () => {
    for (const card of panel.getElementsByClassName("card")) if (!card.status) return;
    // console.log("通关成功");
    clearTimeout(timer);
}

timer = setTimeout(() => window.location.reload(), (start + time) * 1000);
timer = setTimeout(() => {
    flag = true;
    timer = setInterval(() => countdown.innerText = "倒计时: " + time--, 1000);
}, start * 1000);
for (const card of panel.getElementsByClassName("card")) {
    flip(card);
    setTimeout(() => flip(card), start * 1000);
}

function flip(card) {
    card.status = !card.status;
    card.style.transform = "rotateY(90deg)";
    setTimeout(() => {
        card.src = card.status ? "img/" + card.val + ".png" : "img/back.png";
        card.style.transform = "rotateY(0deg)";
    }, t);
}