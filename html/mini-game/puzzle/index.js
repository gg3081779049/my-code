// 地图的行数
const n = 5;
// 地图的列数
const m = 5;
// 当前空格的行数
const x = 4;
// 当前空格的列数
const y = 4;
// 初始空格的行数
const $x = 4;
// 初始空格的列数
const $y = 4;

const map = getMap(n, m, x, y, $x, $y);

let panel = document.getElementById("panel");
let help = document.getElementById("help");

for (let i = 0, w = panel.clientWidth / map.m, h = panel.clientHeight / map.n; i < map.n; i++) {
    for (let j = 0; j < map.m; j++) {
        let cell = document.createElement("div");
        cell.X = i;
        cell.Y = j;
        cell.Z = map.arr[i][j];
        cell.className = "cell";
        cell.style.backgroundSize = panel.clientWidth + "px " + panel.clientHeight + "px";
        cell.style.backgroundPosition = -map.arr[i][j] % map.m * w + "px " + -~~(map.arr[i][j] / map.m) * h + "px";
        cell.style.width = w + "px";
        cell.style.height = h + "px";
        cell.style.left = cell.Y * w + "px";
        cell.style.top = cell.X * h + "px";
        if (i !== map.x || j !== map.y) {
            panel.appendChild(cell);
            cell.onclick = () => {
                if (Math.hypot(cell.X - map.x, cell.Y - map.y) === 1) {
                    cell.style.left = map.y * w + "px";
                    cell.style.top = map.x * h + "px";
                    [cell.X, cell.Y, map.x, map.y] = [map.x, map.y, cell.X, cell.Y];
                    [map.arr[cell.X][cell.Y], map.arr[map.x][map.y]] =
                        [map.arr[map.x][map.y], map.arr[cell.X][cell.Y]];
                }
            }
        }
    }
}

function getMap(n, m, x, y, $x, $y) {
    let map = [...Array(n * m)]
        .map((k, i) => i === $x * m + $y ? null : i)
        .map((k, i, arr) => {
            // 使用 Fisher-Yates 洗牌算法
            let j = i + (i < arr.length - 1) + Math.floor(Math.random() * (arr.length - 1 - i));
            [arr[i], arr[j]] = [arr[j], arr[i]];
            return arr[i];
        })
        .map((k, i, arr) => {
            if (i === 0) [arr[arr.indexOf(null)], arr[x * m + y]] = [arr[x * m + y], arr[arr.indexOf(null)]];
            while (i === 0) {
                // 判断arr的逆序对数是否为偶数，如果不是偶数则随机置换两个方块，直到arr的逆序对数为偶数
                let flatArr = Array.from({ length: n }, (_, i) => arr.slice(i * m, (i + 1) * m))
                    .map((k, i) => i & 1 ? k.reverse() : k).flat();
                let count = Math.floor(n / 2) * m * (m - 1) / 2 - ($x % 2) * (m + 1);
                for (let i = 0; i < flatArr.length; i++) {
                    for (let j = i + 1; j < flatArr.length; j++) {
                        if (flatArr[i] > flatArr[j] && flatArr[i] !== null && flatArr[j] !== null) count++;
                    }
                }
                if (count % 2) {
                    let i = Math.floor(Math.random() * arr.length);
                    let j = Math.floor(Math.random() * arr.length);
                    if (arr[i] && arr[j]) {
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                    }
                } else {
                    break;
                }
            }
            return arr[i];
        });
    return {
        arr: Array.from({ length: n }, (_, i) => map.slice(i * m, (i + 1) * m)),
        n, m, x, y, $x, $y
    };
}

panel.flag = false;
panel.onclick = () => {
    help.state &= panel.flag;
    panel.flag = false;
    let cells = panel.getElementsByClassName("cell");
    for (const cell of cells) if (cell.X * m + cell.Y - cell.Z) return false;
    for (const cell of cells) cell.onclick = false;
}

help.state = false;
help.onclick = () => {
    if (!help.state) {
        help.state = true;
        execute(new Map(JSON.parse(JSON.stringify(map.arr))).getPath(), 100).then(() => {
            help.state = false;
        });
    }
}

async function execute(dirs, t) {
    let cells = Array.from(panel.getElementsByClassName("cell"));
    for (const dir of dirs) {
        if (!help.state) break;
        let cell = cells.find(cell => cell.X === (map.x + dir[0]) && cell.Y === (map.y + dir[1]));
        if (cell) {
            panel.flag = true;
            cell.click();
        }
        await new Promise(resolve => setTimeout(resolve, t));
    }
}
