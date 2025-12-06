class Board {

    constructor(canvas, cellRadius, backgroundSrc) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.cellRadius = cellRadius
        this.cells = []
        this.pieces = []
        this.boardSize = 7
        this.backgroundLoaded = false

        this.backgroundImage = false
        this.backgroundImage = new Image();
        if (backgroundSrc) {
            this.backgroundImage.onload = () => {
                this.backgroundLoaded = true;
            };
            this.backgroundImage.src = backgroundSrc;
        }

        // Patron del tablero (1 = celda valida, 0 = celda invalida)
        this.boardPattern = [
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        ]

        this.initializeBoard()        
    }

    initializeBoard() { // Inicializa el tablero con las celdas
        const spacing = this.cellRadius * 2.5
        const offsetX = (this.canvas.width - (this.boardSize - 1) * spacing) / 2
        const offsetY = (this.canvas.height - (this.boardSize - 1) * spacing) / 2

        for (let row = 0; row < this.boardSize; row++) {
            this.cells[row] = []
            for (let col = 0; col < this.boardSize; col++) {
                const x = offsetX + col * spacing 
                const y = offsetY + row * spacing
                const cell = new Cell(row, col, x, y, this.cellRadius)
                cell.isValid = this.boardPattern[row][col] === 1
                this.cells[row][col] = cell
            }
        }
    }

    initializePieces(pieceImage) { // Inicializa las piezas en el tablero. Menos en el centro
        this.pieces = []
        const centerRow = Math.floor(this.boardSize / 2)
        const centerCol = Math.floor(this.boardSize / 2)

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = this.cells[row][col]

                // Coloca pieza en todas las celdas válidas excepto el centro
                if (cell.isValid && !(row === centerRow && col === centerCol)) {
                    const piece = new Piece(pieceImage)
                    cell.setPiece(piece)
                    this.pieces.push(piece)
                }
            }
        }
    }

    initializePiecesFromChallenge(pieceImage, challengeConfig) { // Inicializa las piezas desde una configuración de desafío
        this.pieces = []

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = this.cells[row][col]

                // Coloca pieza si la configuración del desafío lo indica (1 = pieza)
                if (cell.isValid && challengeConfig[row][col] === 1) {
                    const piece = new Piece(pieceImage)
                    cell.setPiece(piece)
                    this.pieces.push(piece)
                }
            }
        }
    }

    getCell(row, col) { // Obtiene una celda en una posicion especifica
        if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
            return this.cells[row][col]
        }
        return null
    }

    getCellAtPosition(x, y) { // Obtiene la celda que contiene un punto
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = this.cells[row][col]
                if (cell.isValid && cell.containsPoint(x, y)) {
                    return cell
                }
           }
        }
        return null
    }

    getPieceAtPosition(x, y) { // Obtiene una peiza en una posicion especifica
        for (const piece of this.pieces) {
            if (piece.containsPoint(x,y)) {
                return piece;
            }
        } 
        return null;
    }

    isValidMove(fromCell, toCell) { // Verifica que el movimiento sea valido
        if (!fromCell || !toCell) return false 
        if (!fromCell.hasPiece() || toCell.hasPiece()) return false
        if (!toCell.isValid) return false

        const rowDiff = Math.abs(toCell.row - fromCell.row)
        const colDiff = Math.abs(toCell.col - fromCell.col)

        // Movimiento horizontal/vertical. Saltando una celda.
        if ((rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2)) {
        // Verifica que haya una pieza en medio
            const middleRow = (fromCell.row + toCell.row) / 2
            const middleCol = (fromCell.col + toCell.col) / 2
            const middleCell = this.getCell(middleRow, middleCol) // Verifica que haya una celda

            return middleCell && middleCell.hasPiece()
        }
        return false
    }

    getValidMovesForPiece(piece) { // Obtiene los movimientos validos para una pieza
        if (!piece || !piece.cell) return []

        const validMoves = [] // Movimientos validos
        const directions = [ // Direccion posibles
                            { row: -2, col: 0 }, // Arriba
                            { row: 2, col: 0 }, // Abajo
                            { row: 0, col: -2 }, // Izquierda
                            { row: 0, col: 2 }, // Derecha
                            ]

        for (const dir of directions) {
            const targetRow = piece.cell.row + dir.row
            const targetCol = piece.cell.col + dir.col
            const targetCell = this.getCell(targetRow, targetCol)

            if (this.isValidMove(piece.cell, targetCell)) {
                validMoves.push(targetCell)
            }
        }

        return validMoves
    }

    executeMove(piece, toCell) { // Realiza un movimiento
        if (!this.isValidMove(piece.cell, toCell)) return false

        const fromCell = piece.cell

        // Calcula la celda del medio
        const middleRow = (fromCell.row + toCell.row) / 2
        const middleCol = (fromCell.col + toCell.col) / 2
        const middleCell = this.getCell(middleRow, middleCol)

        // Remueve la pieza del medio
        const capturedPiece = middleCell.removePiece()
        const index = this.pieces.indexOf(capturedPiece)
        if (index > -1) {
            this.pieces.splice(index, 1)
        }

        // Mueve la pieza
        fromCell.removePiece()
        toCell.setPiece(piece)

        return true
    }

    hasValidMoves() { // Chequqea si hay movimientos posibles en el tablero
        for (const piece of this.pieces) {
            if (this.getValidMovesForPiece(piece).length > 0) {
                return true
            }
        }
        return false
    }

    getRemainingPieces() { // Chequea las iezas restantes
        return this.pieces.length
    }

    draw() { // Dibuja el tablero completo
        const ctx = this.ctx;
        
        //Dibuja el tablero con  el fondo si esta cargado
        if (this.backgroundLoaded) {
            ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        }

        // Dibuja las celdas
        const centerRow = Math.floor(this.boardSize / 2) // Fila del centro
        const centerCol = Math.floor(this.boardSize / 2) // Columna del centro        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (row == centerRow && col == centerCol) {
                    this.cells[row][col].drawCenterCell(this.ctx)
                } else {
                    this.cells[row][col].draw(this.ctx)
                }
            }
        }

        // Dibuja las piezas
        for (const piece of this.pieces) {
            if (!piece.isDragging) {
                piece.draw(this.ctx)
            }
        }

        // Dibuja la pieza que se esta arrastrando al final
        for (const piece of this.pieces) {
            if (piece.isDragging) {
                piece.draw(this.ctx)
            }
        }
    }

    reset(pieceImageSrc) { // Reset de las piezas y celdas.
        this.pieces = []
        this.cells = []

        this.initializeBoard()

        this.initializePieces(pieceImageSrc)
    }

}

window.Board = Board;
