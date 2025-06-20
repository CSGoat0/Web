// initializing the player class
class Player {
    constructor(sym, clr) {
        this.symbol = sym;
        this.color = clr;
    }
    myturn;
}
p1 = new Player("X", "red");
p1.myturn = true;
p2 = new Player("O", "green");
p2.myturn = false;

// cells functionality
let cells = document.querySelectorAll(".cell");
cells.forEach((value) => {
    value.addEventListener('click', () => {
        if (p1.myturn && value.textContent == "") {
            value.textContent = p1.symbol;
            value.style.color = p1.color;
            p1.myturn = false;
            p2.myturn = true;
        }
        else if (p2.myturn && value.textContent == "") {
            value.textContent = p2.symbol;
            value.style.color = p2.color;
            p1.myturn = true;
            p2.myturn = false;
        }

        if (isWin()) {
            let span = document.createElement("span");
            span.textContent = `${p1.myturn ? p2.symbol : p1.symbol} Wins!`
            span.style.opacity = "0";
            interval = setInterval(() => {
                let op = +span.style.opacity;
                op += 0.1;
                span.style.opacity = `${op}`;
                if (op >= 1) {
                    clearInterval(interval);
                }
            }, 120);

            let btn = document.createElement("input");
            btn.type = "button";
            btn.value = "RETRY";
            btn.id = "retry";
            btn.style.opacity = "0";
            btnInterval = setInterval(() => {
                let op = +btn.style.opacity;
                op += 0.1;
                btn.style.opacity = `${op}`;
                if (op >= 1) {
                    clearInterval(btnInterval);
                }
            }, 120);
            btn.onclick = function () {
                history.go(0);
            }

            let container = document.getElementById("game-board");
            container.innerHTML = "";
            container.style = `
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            width: 300px;
            height: 300px;
            font-size: 30px;
            color: white;
            flex-wrap: wrap;
            align-content: center;
            `;
            container.append(span, btn);
        }
        else if (isDraw()) {
            let span = document.createElement("span");
            span.textContent = `Draw!`
            span.style.opacity = "0";
            interval = setInterval(() => {
                let op = +span.style.opacity;
                op += 0.1;
                span.style.opacity = `${op}`;
                if (op >= 1) {
                    clearInterval(interval);
                }
            }, 120);

            let btn = document.createElement("input");
            btn.type = "button";
            btn.value = "RETRY";
            btn.id = "retry";
            btn.style.opacity = "0";
            btnInterval = setInterval(() => {
                let op = +btn.style.opacity;
                op += 0.1;
                btn.style.opacity = `${op}`;
                if (op >= 1) {
                    clearInterval(btnInterval);
                }
            }, 120);
            btn.onclick = function () {
                history.go(0);
            }

            let container = document.getElementById("game-board");
            container.innerHTML = "";
            container.style = `
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            width: 300px;
            height: 300px;
            font-size: 30px;
            color: white;
            flex-wrap: wrap;
            align-content: center;
            `;
            container.append(span, btn);
        }
    });

    //winning functionality
    function isWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (cells[a].textContent &&
                cells[a].textContent === cells[b].textContent &&
                cells[a].textContent === cells[c].textContent) {
                return true;
            }
        }
        return false;
    }
});

//draw functionality
function isDraw() {
    for (let i = 0; i < 9; i++) {
        if (cells[i].innerHTML == "") {
            return false;
        }
    }
    return true;
}
