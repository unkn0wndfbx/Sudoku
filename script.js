let selectedCell = null; // Variable pour garder la cellule sélectionnée

// Exemple de grille initiale
let initialGrid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// Générer la grille de Sudoku
function generateGrid(grid) {
    const sudokuGrid = document.getElementById("sudoku-grid");
    sudokuGrid.innerHTML = ""; // Vider la grille

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement("div");

            // Ajouter les séparateurs pour les blocs 3x3
            if (i % 3 === 0 && i !== 0) {
                cell.classList.add('separator-top'); // Bordure en haut pour les lignes 3, 6
            }
            if (j % 3 === 0 && j !== 0) {
                cell.classList.add('separator-left'); // Bordure à gauche pour les colonnes 3, 6
            }

            if (grid[i][j] !== 0) {
                cell.textContent = grid[i][j];
                cell.classList.add("fixed"); // Cellules non éditables
            } else {
                cell.addEventListener('click', () => selectCell(cell, i, j));
            }
            sudokuGrid.appendChild(cell);
        }
    }
}

// Gérer la saisie au clavier
document.addEventListener('keydown', (event) => {
    if (selectedCell && event.key >= '1' && event.key <= '9') {
        handleNumberSelection(event.key);  // Appelle la fonction pour gérer la saisie du chiffre
    }
});

// Gérer la sélection de numéro
function handleNumberSelection(number) {
    if (selectedCell) {
        const row = selectedCell.dataset.row;
        const col = selectedCell.dataset.col;
        const value = parseInt(number);

        if (isValidMove(initialGrid, row, col, value)) {
            selectedCell.style.color = "blue"; // En bleu si valide
            initialGrid[row][col] = value;

            // Ajouter la classe "correct" si le mouvement est valide
            selectedCell.classList.add("correct");

        } else {
            selectedCell.style.color = "red"; // En rouge si invalide
        }

        selectedCell.textContent = value; // Mettre à jour l'affichage
        selectedCell.classList.remove("selected");
        selectedCell = null;
    }
}

// Gérer la sélection de cellule (ajuster pour vérifier si elle est correcte)
function selectCell(cell, row, col) {
    // Si la cellule a la classe "correct", ne pas permettre la sélection
    if (cell.classList.contains('correct')) return;

    if (selectedCell) {
        selectedCell.classList.remove("selected");
    }
    selectedCell = cell;
    selectedCell.classList.add("selected");
    selectedCell.dataset.row = row;
    selectedCell.dataset.col = col;
}

// Valider si le mouvement est correct
function isValidMove(grid, row, col, num) {
    row = parseInt(row);
    col = parseInt(col);

    // Vérifier la ligne
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false;
    }

    // Vérifier la colonne
    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false;
    }

    // Vérifier le bloc 3x3
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) return false;
        }
    }

    return true;
}

// Ajouter des événements aux boutons
const numberButtons = document.querySelectorAll('.number-btn');
numberButtons.forEach(button => {
    button.addEventListener('click', () => handleNumberSelection(button.textContent));
});

generateGrid(initialGrid);

function solveSudoku(grid) {
    const emptySpot = findEmptySpot(grid);
    if (!emptySpot) return true; // Sudoku solved

    const [row, col] = emptySpot;

    for (let num = 1; num <= 9; num++) {
        if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveSudoku(grid)) return true;

            grid[row][col] = 0; // Reset and backtrack
        }
    }

    return false;
}

function findEmptySpot(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) return [row, col];
        }
    }
    return null;
}

function revealSolution() {
    if (solveSudoku(initialGrid)) {
        generateGrid(initialGrid); // Régénérer la grille avec la solution
    } else {
        alert("Pas de solution trouvée !");
    }
}

// Ajouter un événement au bouton "Reveal Solution"
document.getElementById('reveal-btn').addEventListener('click', revealSolution);

// Ajouter un événement au bouton "New Game"
function newGame() {
    // Remettre la grille initiale
    const defaultGrid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    // Générer à nouveau la grille
    generateGrid(defaultGrid);

    // Réinitialiser la variable `initialGrid`
    initialGrid = defaultGrid.map(row => [...row]); // Clone la grille
}

document.getElementById('restart-btn').addEventListener('click', newGame);

// Fonction pour effacer le contenu d'une cellule
function eraseCell() {
    if (selectedCell && !selectedCell.classList.contains("fixed") && !selectedCell.classList.contains("correct")) {
        const row = selectedCell.dataset.row;
        const col = selectedCell.dataset.col;

        // Remettre la valeur de la grille à 0
        initialGrid[row][col] = 0;

        // Effacer le contenu de la cellule et sa couleur
        selectedCell.textContent = "";
        selectedCell.style.color = "";

        // Déselectionner la cellule
        selectedCell.classList.remove("selected");
        selectedCell = null;
    }
}

// Ajouter un événement au bouton "Effacer"
document.getElementById('erase-btn').addEventListener('click', eraseCell);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
        eraseCell();  // Appelle la fonction d'effacement si la touche Delete est pressée
    }
});

