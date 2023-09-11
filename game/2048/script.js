const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart');
let tiles = [];
let score = 0;

function setup() {
    grid.innerHTML = '';
    tiles = [];
    score = 0;
    updateScore();

    for (let i = 0; i < 16; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = '';
        grid.appendChild(tile);
        tiles.push(tile);
    }

    addNewTile();
    addNewTile();
}

function addNewTile() {
    const emptyTiles = tiles.filter(tile => !tile.dataset.val);
    if (emptyTiles.length) {
        const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        randomTile.dataset.val = Math.random() < 0.9 ? '2' : '4';
        randomTile.textContent = randomTile.dataset.val;
    }
}

function slide(row) {
    let cells = row.filter(cell => cell.dataset.val).map(cell => cell.dataset.val);
    let newCells = Array(4).fill(null);
    let position = 0;

    for (let i = 0; i < cells.length; i++) {
        if (i < cells.length - 1 && cells[i] === cells[i + 1]) {
            newCells[position] = String(2 * Number(cells[i]));
            score += 2 * Number(cells[i]);
            i++;
        } else {
            newCells[position] = cells[i];
        }
        position++;
    }

    return newCells;
}

function rotate(matrix) {
    const N = matrix.length - 1;
    return matrix.map((row, i) => row.map((_, j) => matrix[N - j][i]));
}

function handleMove(direction) {
    let hasChanged = false;
    let matrix = Array(4).fill().map(() => Array(4).fill(null));

    tiles.forEach((tile, index) => {
        matrix[Math.floor(index / 4)][index % 4] = tile;
        const x = index % 4;
        const y = Math.floor(index / 4);
        tile.dataset.prevPosition = JSON.stringify({ x, y });
    });

    if (direction === "ArrowRight") matrix = matrix.map(row => row.reverse());
    if (direction === "ArrowDown") matrix = rotate(matrix);
    if (direction === "ArrowUp") matrix = rotate(rotate(rotate(matrix)));

    matrix = matrix.map(row => {
        const newRow = slide(row);
        newRow.forEach((val, index) => {
            if (row[index].dataset.val !== val) hasChanged = true;
            if (val) {
                row[index].dataset.val = val;
                row[index].textContent = val;
            } else {
                row[index].removeAttribute('data-val');
                row[index].textContent = '';
            }
        });
        return row;
    });

    if (direction === "ArrowRight") matrix = matrix.map(row => row.reverse());
    if (direction === "ArrowDown") matrix = rotate(rotate(rotate(matrix)));
    if (direction === "ArrowUp") matrix = rotate(matrix);

    updateScore();

    tiles.forEach((tile, index) => {
        const x = index % 4;
        const y = Math.floor(index / 4);
        const prevPosition = JSON.parse(tile.dataset.prevPosition);

        if (x !== prevPosition.x || y !== prevPosition.y) {
            tile.style.transform = `translate(${(x - prevPosition.x) * 100}%, ${(y - prevPosition.y) * 100}%)`;
        }
    });

    setTimeout(() => {
        tiles.forEach(tile => {
            tile.style.transform = '';
        });
    }, 300); 

    if (hasChanged) {
        addNewTile();
        checkGameOver();
    }
}

function updateScore() {
    scoreDisplay.textContent = "점수: " + score;
}

function checkGameOver() {
    if (tiles.every(tile => tile.dataset.val) && !canMakeMove()) {
        alert('게임 오버! 점수는 ' + score + '점입니다.');
        setup();
    }
}

function canMakeMove() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const tile = tiles[y * 4 + x];
            if (x < 3 && tile.dataset.val === tiles[y * 4 + (x + 1)].dataset.val) return true;
            if (y < 3 && tile.dataset.val === tiles[(y + 1) * 4 + x].dataset.val) return true;
        }
    }
    return false;
}

document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)) {
        handleMove(e.key);
    }
});

restartButton.addEventListener('click', setup);

setup();
