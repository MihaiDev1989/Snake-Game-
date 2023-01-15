const ticTacToeContainerElement = document.querySelector(".tic-tac-toe-container");
let cellElements = document.querySelectorAll("[data-cell]");
const winningMessageTextElement = document.querySelector("[data-winning-message-text]");
const winningMessageElement = document.getElementById("winningMessage");
const restartButtonElement = document.getElementById("restartButton");

const X_Class = "x";
const CIRCLE_CLASS = "circle";

const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let optionChose = ["", "", "", "", "", "", "", "", ""];

restartButtonElement.addEventListener("click", startGame);

startGame();

function startGame() {
    optionChose = ["", "", "", "", "", "", "", "", ""];
    ticTacToeContainerElement.classList.add(X_Class);
    ticTacToeContainerElement.classList.remove(CIRCLE_CLASS);

    cellElements.forEach((cell) => {
        if (cell.classList.contains("x")) {
            cell.classList.remove("x");
        } else {
            cell.classList.remove("circle");
        }
        cell.removeEventListener('click', handleClick);
        cell.addEventListener("click", handleClick, { once: true });
    });
    winningMessageElement.classList.remove("show");
}

function handleClick(e) {
    let cellIndex = e.target;
    let index = e.target.getAttribute("data-cell");
    checkClass(index, cellIndex);
    checkWin(curentCLass);
}

function checkClass(index, cellIndex) {
    if (ticTacToeContainerElement.classList.contains(X_Class)) {
        cellIndex.classList.add(X_Class);
        curentCLass = X_Class;
        optionChose[index] = curentCLass;
        ticTacToeContainerElement.classList.remove(X_Class);
        ticTacToeContainerElement.classList.add(CIRCLE_CLASS);
    } else {
        cellIndex.classList.add(CIRCLE_CLASS);
        curentCLass = CIRCLE_CLASS;
        optionChose[index] = curentCLass;
        ticTacToeContainerElement.classList.add(X_Class);
        ticTacToeContainerElement.classList.remove(CIRCLE_CLASS);
    }
}

function checkWin(curentCLass) {
    for (let i = 0; i < winningCombination.length; i++) {
        const winningCombinationItems = winningCombination[i];
        let cellA = optionChose[winningCombinationItems[0]];
        let cellB = optionChose[winningCombinationItems[1]];
        let cellC = optionChose[winningCombinationItems[2]];
        if (cellA === curentCLass && cellB == curentCLass && cellC == curentCLass) {
            if (curentCLass == "x") {
                winningMessageTextElement.innerText = "X's Wins!!";
            } else {
                winningMessageTextElement.innerText = "O's Wins!!";
            }
            winningMessageElement.classList.add("show");
        } else if (!optionChose.includes("")) {
            winningMessageTextElement.innerText = "Draw!!";
            winningMessageElement.classList.add("show");
        } else {
            continue;
        }
    }
}