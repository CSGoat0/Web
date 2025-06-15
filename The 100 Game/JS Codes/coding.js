//main variables
let winner = 0;
let score = 0;

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
let numbers = document.getElementById("p1_numbers").querySelectorAll(".numbers");
numbers.forEach((value, key, parent) => {
    value.onclick = function () {
        score += +value.value;
        console.log(score);
    }
});

//Set Turnes
let p1 = true;
let p2 = false;
let display_turn = document.getElementById("turn");
let turn_span = document.querySelector("#turn span");
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

//Timer Functionality
let timer = 40;
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
        else {
            if (p1) {
                winner = 2;
            } else {
                winner = 1;
            }
            clearInterval(id);
        }
        if (score >= 100) {
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
}, 100, timer);