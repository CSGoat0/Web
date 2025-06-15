//main variables
let winner = 0;
let score = 0;
let timer = 40;
let p1 = true;
let p2 = false;

//start game functionality
function isStarted() {
    let startBtn = document.getElementById("start");
    if (startBtn.style.display === "none") {
        return true;
    }
    else
        return false;
}

//Functionality of start button
let strtbtn = document.getElementById("start");
strtbtn.onclick = function () {
    strtbtn.style.display = "none";
    let midcontent = document.getElementById("mid_content");
    midcontent.style.display = "block";
}

//score increment
const scoreCounter = document.getElementById("score_counter");
let display_turn = document.getElementById("turn");
let turn_span = document.querySelector("#turn span");

document.getElementById("p1_numbers").querySelectorAll(".numbers").forEach(button => {
    button.addEventListener("click", () => {
        if (p1 && !winner) {
            score += +button.value;
            p1 = false;
            p2 = true;
            scoreCounter.textContent = score;
        }
        if (score >= 100) {
            if (p1) {
                winner = 2;
            } else {
                winner = 1;
            }
            clearInterval(id);
        }
        if (timer === 0) {
            if (p1) {
                winner = 2;
            } else {
                winner = 1;
            }
            clearInterval(id);
        }
        if (winner) {
            let displayWinner = document.getElementById("score");
            let span = document.createElement("span");
            span.textContent = `Player ${winner} Wins`;
            displayWinner.innerHTML = "";
            displayWinner.append(span);
            display_turn.style.display = "none";
        }
        if (p1) {
            display_turn.style.justifyContent = "left";
            turn_span.style = "\
            background: crimson;\
            border: 2px solid black;\
            padding: 5px;\
            margin: 2px;\
            border-top-left-radius: 0px;\
            border-top-right-radius: 20px;\
            "
        } else if (p2) {
            display_turn.style.justifyContent = "right";
            turn_span.style = "\
            background: crimson;\
            border: 2px solid black;\
            padding: 5px;\
            margin: 2px;\
            border-top-right-radius: 0px;\
            border-top-left-radius: 20px;\
            "
        }
    });
});

document.getElementById("p2_numbers").querySelectorAll(".numbers").forEach(button => {
    button.addEventListener("click", () => {
        if (p2 && !winner) {
            score += +button.value;
            p2 = false;
            p1 = true;
            scoreCounter.textContent = score;
        }
        if (score >= 100) {
            if (p1) {
                winner = 2;
            } else {
                winner = 1;
            }
            clearInterval(id);
        }
        if (timer === 0) {
            if (p1) {
                winner = 2;
            } else {
                winner = 1;
            }
            clearInterval(id);
        }
        if (winner) {
            let displayWinner = document.getElementById("score");
            let span = document.createElement("span");
            span.textContent = `Player ${winner} Wins`;
            displayWinner.innerHTML = "";
            displayWinner.append(span);
            display_turn.style.display = "none";
        }
        if (p1) {
            display_turn.style.justifyContent = "left";
            turn_span.style = "\
            background: crimson;\
            border: 2px solid black;\
            padding: 5px;\
            margin: 2px;\
            border-top-left-radius: 0px;\
            border-top-right-radius: 20px;\
            "
        } else if (p2) {
            display_turn.style.justifyContent = "right";
            turn_span.style = "\
            background: crimson;\
            border: 2px solid black;\
            padding: 5px;\
            margin: 2px;\
            border-top-right-radius: 0px;\
            border-top-left-radius: 20px;\
            "
        }
    });
});

scoreCounter.textContent = score;

//Timer Functionality
let timerRenderer = document.getElementById("timer_circle");
let timerspan = document.createElement("span");
timerspan.textContent = timer;
timerRenderer.append(timerspan);
let id = setInterval(() => {
    if (isStarted()) {
        if (timer !== 0) {
            timer--;
            timerspan.textContent = timer;
        }
        if (timer === 0) {
            if (p1) {
                winner = 2;
            } else {
                winner = 1;
            }
            clearInterval(id);
        }
        if (winner) {
            let displayWinner = document.getElementById("score");
            let span = document.createElement("span");
            span.textContent = `Player ${winner} Wins`;
            displayWinner.innerHTML = "";
            displayWinner.append(span);
            display_turn.style.display = "none";
        }
    }
}, 2000, timer);

//To Restart the game
let restart = document.getElementById("restart");
restart.onclick = function () {
    history.go(0);
}