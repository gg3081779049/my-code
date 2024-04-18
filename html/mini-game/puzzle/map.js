class Map {
    arr;
    n;
    m;
    x;
    y;
    $x;
    $y;

    constructor(arr) {
        if (this.countInv(arr) % 2) {
            throw new Error("Unsolvable ~~");
        } else {
            this.arr = arr;
            this.n = this.arr.length;
            this.m = this.arr[0].length;
            for (let i = 0; i < this.arr.length; i++) {
                for (let j = 0; j < this.arr[i].length; j++) {
                    if (!this.find(i * this.m + j)) {
                        this.$x = i;
                        this.$y = j;
                    }
                    if (this.arr[i][j] === null) {
                        this.x = i;
                        this.y = j;
                    }
                }
            }
        }
    }

    orders;
    move (...dirs) {
        for (const dir of dirs) {
            this.orders.push(dir);
            [this.arr[this.x][this.y], this.arr[this.x + dir[0]][this.y + dir[1]]]
                = [this.arr[this.x + dir[0]][this.y + dir[1]], this.arr[this.x][this.y]];
            this.x += dir[0];
            this.y += dir[1];
        }
    }

    find (value) {
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = 0; j < this.arr[i].length; j++) {
                if (this.arr[i][j] === value) return [i, j];
            }
        }
    }

    countInv(arr) {
        // 蛇形扁平二维数组, 然后计算逆序数
        let flatArr = JSON.parse(JSON.stringify(arr)).map((k, i) => i & 1 ? k.reverse() : k).flat();
        let count = 0;
        for (let i = 0; i < flatArr.length; i++) {
            for (let j = i + 1; j < flatArr.length; j++) {
                if (flatArr[i] !== null && flatArr[j] !== null && flatArr[i] > flatArr[j]) count++;
            }
        }
        return count;
    }

    bfs (x, y, fn) {
        const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        const queue = [[this.x, this.y, []]];
        const set = new Set();
        while (queue.length) {
            const [_x, _y, path] = queue.shift();
            set.add(`${_x},${_y}`);
            if (x === _x && y === _y) return path;
            for (const dir of dirs) {
                let [nx, ny] = [_x + dir[0], _y + dir[1]];
                if (nx >= 0 && nx < this.arr.length && ny >= 0 && ny < this.arr[nx].length
                    && fn(nx, ny) && !set.has(`${nx},${ny}`)) {
                    queue.push([nx, ny, [...path, dir]]);
                    set.add(`${nx},${ny}`);
                }
            }
        }
        return [];
    }

    getPath () {
        this.orders = [];
        let map = [...Array(this.n)].map(() => [...Array(this.m)].map(() => true));
        for (let i of [...Array(this.n - 2)].map((k, i) =>
            i < this.$x - 1 ? i : this.n + this.$x - 2 - i)) {
            for (let j = 0; j < this.arr[i].length; map[i][j] = false, j++) {
                if (this.arr[i][j] !== i * this.m + j) {
                    let $ = Math.sign(this.$x - i);
                    let flag = j === this.m - 1 && (this.arr[i][j] || this.arr[i + $][j] !== i * this.m + j);
                    let [tx, ty] = flag ? [i + $, j - 1] : [i, j];
                    for (let [x, y] = this.find(i * this.m + j); x !== tx || y !== ty; [x, y] = this.find(i * this.m + j)) {
                        let _tx = x + Math.sign((tx - x) *! (ty - y));
                        let _ty = y + Math.sign(ty - y);
                        this.move(...this.bfs(_tx, _ty,(fx, fy) => this.arr[fx][fy] !== i * this.m + j && map[fx][fy]));
                        this.move([x - this.x, y - this.y]);
                    }
                    if (flag) {
                        this.move(...this.bfs(i + $, j - 2, (fx, fy) => this.arr[fx][fy] !== i * this.m + j && map[fx][fy]));
                        this.move([-$, 0], [0, 1], [$, 0], [0, 1], [-$, 0], [0, -1], [0, -1], [$, 0]);
                    }
                }
            }
        }

        // 调整中间(this.$x - 1)和(this.$x)行的方块
        for (let j of [...Array(this.m - 2)].map((k, j) =>
            j < this.$y - 1 ? j : this.m + this.$y - 2 - j).concat(this.$y - 1)) {
            for (let i = this.$x - 1; i < this.$x + 1; map[i][j] = false, i++) {
                if (this.arr[i][j] !== i * this.m + j) {
                    let $ = Math.sign(this.$y - j);
                    let flag = i === this.$x && (this.arr[i][j] || this.arr[i][j + $] !== i * this.m + j);
                    let [tx, ty] = flag ? [i, j + 2 * $] : [i, j];
                    for (let [x, y] = this.find(i * this.m + j); x !== tx || y !== ty; [x, y] = this.find(i * this.m + j)) {
                        let _tx = x + Math.sign(tx - x);
                        let _ty = y + Math.sign((ty - y) *! (tx - x));
                        this.move(...this.bfs(_tx, _ty,(fx, fy) => this.arr[fx][fy] !== i * this.m + j && map[fx][fy]));
                        this.move([x - this.x, y - this.y]);
                    }
                    if (flag) {
                        this.move(...this.bfs(i, j + $, (fx, fy) => this.arr[fx][fy] !== i * this.m + j && map[fx][fy]));
                        this.move([0, -$], [-1, 0], [0, $], [1, 0], [0, $], [-1, 0], [0, -$], [0, -$], [1, 0], [0, $]);
                    }
                }
            }
        }

        //调整最后一个方块
        if (this.arr[this.$x][this.$y] !== null) this.move([1, 0]);
        return this.orders;
    }

}
