// initializing the player class
class Player {
    constructor(sym) {
        this.symbol = sym;
    }
    myturn;
}
p1 = new Player("X");
p1.myturn = true;
p2 = new Player("O");
p2.myturn = false;

// cells functionality
let cells = document.querySelectorAll(".cell");
cells.forEach((value) => {
    value.addEventListener('click', () => {
        if (p1.myturn && value.textContent == "") {
            value.textContent = p1.symbol;
            p1.myturn = false;
            p2.myturn = true;
        }
        else if (p2.myturn && value.textContent == "") {
            value.textContent = p2.symbol;
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
        if (cells[0].textContent === p1.symbol && cells[4].textContent === p1.symbol && cells[8].textContent === p1.symbol) {
            return true;
        }
        else if (cells[0].textContent === p2.symbol && cells[4].textContent === p2.symbol && cells[8].textContent === p2.symbol) {
            return true;
        }
        else if (cells[2].textContent === p1.symbol && cells[4].textContent === p1.symbol && cells[6].textContent === p1.symbol) {
            return true;
        }
        else if (cells[2].textContent === p2.symbol && cells[4].textContent === p2.symbol && cells[6].textContent === p2.symbol) {
            return true;
        }
        for (let i = 0; i < 9; i += 3) {
            let counter = 0;
            for (let j = i; j < i + 3; j++) {
                if (cells[j].textContent === p1.symbol) {
                    counter++;
                }
                else {
                    break;
                }
            }
            if (counter >= 3) {
                return true;
            }
        }
        for (let i = 0; i < 9; i += 3) {
            let counter = 0;
            for (let j = i; j < i + 3; j++) {
                if (cells[j].textContent === p2.symbol) {
                    counter++;
                }
                else {
                    break;
                }
            }
            if (counter >= 3) {
                return true;
            }
        }
        for (let i = 0; i < 3; i++) {
            let counter = 0;
            for (let j = i; j < 9; j += 3) {
                if (cells[j].textContent === p1.symbol) {
                    counter++;
                }
                else {
                    break;
                }
            }
            if (counter >= 3) {
                return true;
            }
        }
        for (let i = 0; i < 3; i++) {
            let counter = 0;
            for (let j = i; j < 9; j += 3) {
                if (cells[j].textContent === p2.symbol) {
                    counter++;
                }
                else {
                    break;
                }
            }
            if (counter >= 3) {
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
