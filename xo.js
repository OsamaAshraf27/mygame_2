const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // الصفوف
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // الأعمدة
    [0, 4, 8], [2, 4, 6]             // الأقطار
];

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');

    if (board[index] !== "" || !isGameActive) return;

    board[index] = currentPlayer;
    e.target.innerText = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());

    checkResult();
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.innerText = `🎉 الفائز هو اللاعب ${currentPlayer}!`;
        isGameActive = false;
        return;
    }

    if (!board.includes("")) {
        statusText.innerText = "تعادل! 🤝";
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `دور اللاعب: ${currentPlayer}`;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    statusText.innerText = "دور اللاعب: X";
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o');
    });
}