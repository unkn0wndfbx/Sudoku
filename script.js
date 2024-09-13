let selectedCell = null; // Variable pour garder la cellule sélectionnée
let currentGrid = []; // Stocke la grille actuelle
let solvedGrid = []; // Stocke la grille résolue

const nombreAleatoire = (nombreMax) => Math.trunc(Math.random() * nombreMax);

async function fetchSudoku(difficulty = 'hard') {
    try {
        const response = await fetch('grid.json');
        if (!response.ok) {
            throw new Error('Fichier pas trouvé!');
        }
        const grilles = await response.json();
        if (grilles.length === 0) {
            throw new Error('Aucune grille trouvée!');
        }
        const numeroGrille = nombreAleatoire(grilles.length);
        const sudoku = grilles[numeroGrille];
        const grille = sudoku.grille;
        solvedGrid = sudoku.solvedgrille;

        currentGrid = grille;
        generateGrid(grille);

    } catch (error) {
        console.error('Erreur lors de la récupération de la grille de Sudoku :', error);
    }
}

// Générer la grille de Sudoku
function generateGrid(grid) {
    const sudokuGrid = document.getElementById("sudoku-grid");
    sudokuGrid.innerHTML = ""; // Vider la grille
    console.log('Génération de la grille');  // Debugging

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement("div");

            if (i % 3 === 0 && i !== 0) {
                cell.classList.add('separator-top');
            }
            if (j % 3 === 0 && j !== 0) {
                cell.classList.add('separator-left');
            }

            if (grid[i][j] !== null) {
                cell.textContent = grid[i][j];
                cell.classList.add("fixed");
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

// Ajouter des événements aux boutons
const numberButtons = document.querySelectorAll('.number-btn');
numberButtons.forEach(button => {
    button.addEventListener('click', () => handleNumberSelection(button.textContent));
});

// Gérer la sélection de numéro
function handleNumberSelection(number) {
    if (selectedCell) {
        const row = selectedCell.dataset.row;
        const col = selectedCell.dataset.col;
        const value = parseInt(number);

        if (isValidMove(row, col, value)) {
            selectedCell.style.color = "blue"; // En bleu si valide
            currentGrid[row][col] = value;

            selectedCell.classList.add("correct");
        } else {
            selectedCell.style.color = "red"; // En rouge si invalide
        }

        selectedCell.textContent = value; // Mettre à jour l'affichage
        selectedCell.classList.remove("selected");
        selectedCell = null;
    }
}

// Gérer la sélection de cellule
function selectCell(cell, row, col) {
    if (cell.classList.contains('correct')) return;

    if (selectedCell) {
        selectedCell.classList.remove("selected");
    }
    selectedCell = cell;
    selectedCell.classList.add("selected");
    selectedCell.dataset.row = row;
    selectedCell.dataset.col = col;

    console.log('Selected cell:', selectedCell);
    console.log('Row:', row, 'Col:', col);
}

// Valider si le mouvement est correct
function isValidMove(row, col, num) {
    row = parseInt(row);
    col = parseInt(col);

    // Vérifier la ligne
    for (let x = 0; x < 9; x++) {
        if (currentGrid[row][x] === num) return false;
    }

    // Vérifier la colonne
    for (let x = 0; x < 9; x++) {
        if (currentGrid[x][col] === num) return false;
    }

    // Vérifier le bloc 3x3
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (currentGrid[i + startRow][j + startCol] === num) return false;
        }
    }

    return true;
}

// Résoudre le Sudoku
function solveSudoku(grid) {
    const emptySpot = findEmptySpot(grid);
    if (!emptySpot) return true;

    const [row, col] = emptySpot;

    for (let num = 1; num <= 9; num++) {
        if (isValidMove(row, col, num)) {
            grid[row][col] = num;

            if (solveSudoku(grid)) return true;

            grid[row][col] = 0; // Reset
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
    if (solveSudoku(currentGrid)) {
        generateGrid(solvedGrid); // Régénérer la grille avec la solution
    } else {
        alert("Pas de solution trouvée !");
    }
}

// Ajouter un événement au bouton "Révéler la solution"
document.getElementById('reveal-btn').addEventListener('click', revealSolution);

// Ajouter un événement au bouton "Nouvelle Partie"
document.getElementById('restart-btn').addEventListener('click', fetchSudoku);

// Effacer le contenu d'une cellule
function eraseCell() {
    if (selectedCell && !selectedCell.classList.contains("fixed") && !selectedCell.classList.contains("correct")) {
        const row = selectedCell.dataset.row;
        const col = selectedCell.dataset.col;

        currentGrid[row][col] = 0;

        selectedCell.textContent = "";
        selectedCell.style.color = "";

        selectedCell.classList.remove("selected");
        selectedCell = null;
    }
}

// Ajouter un événement au bouton "Effacer"
document.getElementById('erase-btn').addEventListener('click', eraseCell);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
        eraseCell();
    }
});

// Charger une grille dès le chargement de la page
fetchSudoku();
