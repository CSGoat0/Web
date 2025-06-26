"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _MovementManager_ranges, _FoodManager_instances, _FoodManager_checkFood, _FoodManager_foodSymbol;
// create pokemon class
class Pokemon {
    constructor(board, currentPosition, headSymbol, untiSpeed = 300) {
        this.score = -1;
        this.endGame = false;
        this.board = board;
        this.current = currentPosition;
        this.headSymbol = headSymbol;
        this.antiSpeed = untiSpeed;
    }
}
class MovementManager {
    //to check wither the apple is in my range or not, so i know where to move
    checkRange(index1, index2) {
        for (let [x, y] of __classPrivateFieldGet(this, _MovementManager_ranges, "f")) {
            if (index1 >= x && index1 <= y) {
                if (index2 >= x && index2 <= y) {
                    return true;
                }
                return false;
            }
        }
        return false;
    }
    //to check boarders
    maxRightBoarder(number) {
        if (!((number + 1) % 28) && number !== 0) {
            return true;
        }
        else
            return false;
    }
    maxLeftBoarder(number) {
        if (number < 0 || !(number % 28)) {
            return true;
        }
        else
            return false;
    }
    maxTopBoarder(number) {
        if (number - 28 < 0) {
            return true;
        }
        else
            return false;
    }
    maxBottomBoarder(number) {
        if (number + 28 > 559) {
            return true;
        }
        else
            return false;
    }
    constructor(pokemon) {
        //directions
        this.up = false;
        this.right = true;
        this.down = false;
        this.left = false;
        //to check wither the apple is in my range or not, so i know where to move
        _MovementManager_ranges.set(this, [[0, 27], [28, 55], [56, 83], [84, 111], [112, 139], [140, 167], [168, 195], [196, 223], [224, 251],
            [252, 279], [280, 307], [308, 335], [336, 363], [364, 391], [392, 419], [420, 447], [448, 475], [476, 503],
            [504, 531], [532, 559]]);
        this.pokemon = pokemon;
    }
    //initiate pokemon movement
    IMove() {
        let interval = setInterval(() => {
            try {
                if (this.up) {
                    if (!this.maxTopBoarder(this.pokemon.current)) {
                        this.pokemon.board[this.pokemon.current].textContent = "";
                        this.pokemon.board[this.pokemon.current -= 28].textContent = this.pokemon.headSymbol;
                    }
                    else {
                        clearInterval(interval);
                        this.pokemon.endGame = true;
                    }
                    ;
                }
                else if (this.right) {
                    if (!this.maxRightBoarder(this.pokemon.current)) {
                        this.pokemon.board[this.pokemon.current].textContent = "";
                        this.pokemon.board[++this.pokemon.current].textContent = this.pokemon.headSymbol;
                    }
                    else {
                        clearInterval(interval);
                        this.pokemon.endGame = true;
                    }
                    ;
                }
                else if (this.left) {
                    if (!this.maxLeftBoarder(this.pokemon.current)) {
                        this.pokemon.board[this.pokemon.current].textContent = "";
                        this.pokemon.board[--this.pokemon.current].textContent = this.pokemon.headSymbol;
                    }
                    else {
                        clearInterval(interval);
                        this.pokemon.endGame = true;
                    }
                    ;
                }
                else if (this.down) {
                    if (!this.maxBottomBoarder(this.pokemon.current)) {
                        this.pokemon.board[this.pokemon.current].textContent = "";
                        this.pokemon.board[this.pokemon.current += 28].textContent = this.pokemon.headSymbol;
                    }
                    else {
                        clearInterval(interval);
                        this.pokemon.endGame = true;
                    }
                    ;
                }
                if (this.pokemon.endGame) {
                    clearInterval(interval);
                }
            }
            catch (error) {
                clearInterval(interval);
                this.pokemon.endGame = true;
                console.log(error);
            }
        }, this.pokemon.antiSpeed);
    }
    //to detect movement direction, if same range go right or left, otherwise go up or down
    IMoveTo(index = undefined) {
        if (index === undefined) {
            return;
        }
        if (this.checkRange(index, this.pokemon.current)) {
            if (this.pokemon.current < index) {
                this.up = false;
                this.down = false;
                this.right = true;
                this.left = false;
            }
            else if (this.pokemon.current > index) {
                this.up = false;
                this.right = false;
                this.down = false;
                this.left = true;
            }
        }
        else if (this.pokemon.current > index) {
            this.up = true;
            this.right = false;
            this.down = false;
            this.left = false;
        }
        else if (this.pokemon.current < index) {
            this.up = false;
            this.right = false;
            this.down = true;
            this.left = false;
        }
    }
}
_MovementManager_ranges = new WeakMap();
class Ghost extends MovementManager {
    constructor(pokemon, target) {
        super(pokemon);
        this.target = target;
    }
    generateMovement() {
        interval = setInterval(() => {
            let rand = getRandomInt(1, 4);
            if (rand === 1) {
                this.up = false;
                this.right = true;
                this.down = false;
                this.left = false;
            }
            else if (rand === 2) {
                this.up = false;
                this.right = false;
                this.down = true;
                this.left = false;
            }
            else if (rand === 3) {
                this.up = false;
                this.right = false;
                this.down = false;
                this.left = true;
            }
            //rand === 4
            else {
                this.up = true;
                this.right = false;
                this.down = false;
                this.left = false;
            }
        }, 800);
    }
    IMove() {
        let interval = setInterval(() => {
            var _a;
            try {
                const currentCell = this.pokemon.board[this.pokemon.current];
                if ((_a = currentCell.textContent) === null || _a === void 0 ? void 0 : _a.includes(this.pokemon.headSymbol)) {
                    currentCell.textContent = currentCell.textContent.replace(this.pokemon.headSymbol, '');
                }
                if (this.up && !this.maxTopBoarder(this.pokemon.current)) {
                    this.pokemon.current -= 28;
                }
                else if (this.right && !this.maxRightBoarder(this.pokemon.current)) {
                    this.pokemon.current++;
                }
                else if (this.left && !this.maxLeftBoarder(this.pokemon.current)) {
                    this.pokemon.current--;
                }
                else if (this.down && !this.maxBottomBoarder(this.pokemon.current)) {
                    this.pokemon.current += 28;
                }
                else {
                    if (this.maxTopBoarder(this.pokemon.current) && this.up) {
                        this.pokemon.current += 532;
                    }
                    else if (this.maxRightBoarder(this.pokemon.current) && this.right) {
                        this.pokemon.current -= 27;
                    }
                    else if (this.maxBottomBoarder(this.pokemon.current) && this.down) {
                        this.pokemon.current -= 532;
                    }
                    else if (this.maxLeftBoarder(this.pokemon.current) && this.left) {
                        this.pokemon.current += 27;
                    }
                }
                if (this.target.endGame) {
                    clearInterval(interval);
                }
                // Add head symbol to new cell (without removing existing content)
                const newCell = this.pokemon.board[this.pokemon.current];
                newCell.textContent = (newCell.textContent || '') + this.pokemon.headSymbol;
            }
            catch (error) {
                clearInterval(interval);
                this.pokemon.endGame = true;
                console.log(error);
            }
        }, this.pokemon.antiSpeed);
        let loseCheck = setInterval(() => {
            var _a;
            const currentCell = this.pokemon.board[this.pokemon.current];
            if ((_a = currentCell.textContent) === null || _a === void 0 ? void 0 : _a.includes(this.target.headSymbol)) {
                this.target.endGame = true;
            }
            if (this.target.endGame) {
                clearInterval(loseCheck);
            }
        }, 100);
    }
}
class FoodManager {
    constructor(pokemon) {
        _FoodManager_instances.add(this);
        this.food = new Set([
            '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓',
            '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆',
            '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅',
            '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚',
            '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴',
            '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯',
            '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱',
            '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮',
            '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂',
            '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜',
            '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺',
            '🍻', '🥂', '🍷', '🍸', '🍹', '🍾', '🧊', '🥄', '🍴',
            '🍽️', '🥣', '🥡', '🥢', '🧂'
        ]);
        _FoodManager_foodSymbol.set(this, "🍎");
        this.pokemon = pokemon;
    }
    setSymbol(food) {
        for (let element of this.pokemon.board) {
            if (element.textContent === __classPrivateFieldGet(this, _FoodManager_foodSymbol, "f")) {
                element.textContent = food;
            }
        }
        __classPrivateFieldSet(this, _FoodManager_foodSymbol, food, "f");
    }
    //to initiate food
    Ifood() {
        let interval = setInterval(() => {
            if (!__classPrivateFieldGet(this, _FoodManager_instances, "m", _FoodManager_checkFood).call(this)) {
                let rand = getRandomInt(0, 559);
                this.pokemon.board[rand].textContent = __classPrivateFieldGet(this, _FoodManager_foodSymbol, "f");
                this.pokemon.score++;
            }
            if (this.pokemon.endGame) {
                clearInterval(interval);
            }
            ;
        }, 200);
    }
}
_FoodManager_foodSymbol = new WeakMap(), _FoodManager_instances = new WeakSet(), _FoodManager_checkFood = function _FoodManager_checkFood() {
    for (let element of this.pokemon.board) {
        if (element.textContent &&
            [...element.textContent].some(char => this.food.has(char))) {
            return true;
        }
    }
    return false;
};
// initialize a snake
let cells = document.querySelectorAll(".cell");
let pk1 = new Pokemon(cells, 0, '🤪', 200);
let mManager = new MovementManager(pk1);
let fManager = new FoodManager(pk1);
let index = undefined;
mManager.IMove();
fManager.Ifood();
let interval = setInterval(() => {
    if (index === pk1.current) {
        index = undefined;
    }
    if (pk1.endGame) {
        clearInterval(interval);
    }
    mManager.IMoveTo(index);
}, pk1.antiSpeed);
//move on click functionality
cells.forEach((e) => {
    e.addEventListener('click', () => {
        index = Number(e.dataset.index) - 1;
    });
});
//generate random number
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//timer functionality
let timerElement = document.getElementById("timer");
let hours = 0, minutes = 0, seconds = 0;
let timerInterval = setInterval(() => {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }
    if (pk1.endGame) {
        clearInterval(timerInterval);
    }
    timerElement.textContent = `Time: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}, 1000);
//score functionality
let score = document.getElementById("score");
let scoreInterval = setInterval(() => {
    score.textContent = `Score: ${pk1.score}`;
    if (pk1.endGame) {
        clearInterval(timerInterval);
    }
}, 200);
//Restart Functionality
let resBtn = document.getElementById("restart");
resBtn.onclick = () => {
    history.go(0);
};
//Ghost Functionality
const ghostFaces = [
    '😡', '🤬', '🥵', '🥶', '😱', '🤢', '😈',
    '👿', '👹', '👺', '🤡', '👻', '💀', '☠️',
    '👽', '👾', '🤖', '🎃'
];
let ghostBtn = document.getElementById("add-ghost");
let diffRange = document.getElementById("range");
ghostBtn.onclick = () => {
    let ghost = new Pokemon(cells, getRandomInt(0, 559), ghostFaces[getRandomInt(0, 17)], 1000 - Number(diffRange.value));
    let ghostMove = new Ghost(ghost, pk1);
    ghostMove.IMove();
    ghostMove.generateMovement();
};
//adding faces and foods to select list
const faces = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
    '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
    '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
    '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾',
    '🤖', '🎃'
];
const food = [
    '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓',
    '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆',
    '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅',
    '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚',
    '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴',
    '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯',
    '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱',
    '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮',
    '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂',
    '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜',
    '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺',
    '🍻', '🥂', '🍷', '🍸', '🍹', '🍾', '🧊', '🥄', '🍴',
    '🍽️', '🥣', '🥡', '🥢', '🧂'
];
let pokemon = document.getElementById("pokemon");
let foods = document.getElementById("food");
faces.forEach(emoji => {
    const option = new Option(emoji, emoji);
    pokemon.add(option);
});
food.forEach(emoji => {
    const option = new Option(emoji, emoji);
    foods.add(option);
});
pokemon.addEventListener('change', () => {
    pk1.headSymbol = pokemon.value;
});
foods.addEventListener('change', () => {
    fManager.setSymbol(foods.value);
});
//rules button
let rules = document.getElementById("rules");
rules.onclick = () => {
    location.replace("rules.html");
};
//on lose function
function onLose() {
    let defeat = document.getElementById("defeat");
    defeat.style.visibility = "visible";
    let gameWindow = document.getElementById("game-board");
    let currentOpacity = parseFloat(gameWindow.style.opacity) || 1;
    let interval = setInterval(() => {
        currentOpacity -= 0.1;
        gameWindow.style.opacity = String(currentOpacity);
        if (currentOpacity <= 0) {
            gameWindow.style.opacity = '0';
            clearInterval(interval);
            gameWindow.innerHTML = "";
            let otherInterval = setInterval(() => {
                currentOpacity += 0.1;
                gameWindow.style.opacity = String(currentOpacity);
                if (currentOpacity >= 1) {
                    gameWindow.style.opacity = '1';
                    clearInterval(otherInterval);
                    windowRebuild();
                }
            }, 50);
        }
    }, 120);
}
function windowRebuild() {
    let gameWindow = document.getElementById("game-board");
    gameWindow.innerHTML = `
    <div class="rebuilt-cell" data-index="1"></div>
    <div class="rebuilt-cell" data-index="2"></div>
    <div class="rebuilt-cell" data-index="3"></div>
    <div class="rebuilt-cell" data-index="4"></div>
    <div class="rebuilt-cell" data-index="5"></div>
    <div class="rebuilt-cell" data-index="6"></div>
    <div class="rebuilt-cell" data-index="7"></div>
    <div class="rebuilt-cell" data-index="8"></div>
    <div class="rebuilt-cell" data-index="9"></div>
    `;
    gameWindow.style = `
        display: flex;
        flex-direction: row;
        flew-wrap: wrap;
        justify-content: center;
        text-align: center;
        align-content: center;
    `;
    gameWindow.children[6].textContent = pk1.headSymbol;
    gameWindow.children[2].textContent = "🤜";
    let index = 2;
    let adder = 1;
    let interval = setInterval(() => {
        gameWindow.children[index].innerHTML = "";
        if (index <= 1 || index >= 5) {
            adder *= -1;
        }
        index += adder;
        gameWindow.children[index].textContent = "🤜";
        if (index === 5) {
            setTimeout(() => {
                gameWindow.children[6].textContent = "";
                pk1.headSymbol = faces[getRandomInt(0, 101)];
                gameWindow.children[7].textContent = pk1.headSymbol;
            }, 100);
        }
        else {
            setTimeout(() => {
                gameWindow.children[6].textContent = pk1.headSymbol;
                gameWindow.children[7].textContent = "";
            }, 100);
        }
    }, 200);
}
let loseInterval = setInterval(() => {
    if (pk1.endGame) {
        onLose();
        clearInterval(loseInterval);
    }
});
