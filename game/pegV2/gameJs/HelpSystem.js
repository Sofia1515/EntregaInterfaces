// Sistema de ayudas para el juego Peg Solitaire

class HelpSystem {
    constructor(game) {
        this.game = game
        this.moveHistory = [] // Historial de movimientos para deshacer
        this.helpUsed = {
            undo: 0,
            freePlacement: 0,
            hint: 0
        }
        this.maxHelpsPerGame = 3 // Máximo de ayudas por tipo por juego
        this.isFreePlacementActive = false // Modo de colocación libre activo
    }

    // Registrar un movimiento en el historial
    recordMove(fromCell, toCell, capturedPiece) {
        this.moveHistory.push({
            fromCell: { row: fromCell.row, col: fromCell.col },
            toCell: { row: toCell.row, col: toCell.col },
            capturedPiece: capturedPiece,
            timestamp: Date.now()
        })
    }

    // Deshacer último movimiento
    undoLastMove() {
        if (this.moveHistory.length === 0) {
            return { success: false, message: "No hay movimientos para deshacer" }
        }

        if (this.helpUsed.undo >= this.maxHelpsPerGame) {
            return { success: false, message: `Ya usaste el máximo de deshacer (${this.maxHelpsPerGame})` }
        }

        const lastMove = this.moveHistory.pop()
        const fromCell = this.game.board.getCell(lastMove.fromCell.row, lastMove.fromCell.col)
        const toCell = this.game.board.getCell(lastMove.toCell.row, lastMove.toCell.col)
        const capturedCell = this.game.board.getCell(
            (lastMove.fromCell.row + lastMove.toCell.row) / 2,
            (lastMove.fromCell.col + lastMove.toCell.col) / 2
        )

        // Deshacer el movimiento
        const piece = toCell.removePiece()
        fromCell.setPiece(piece)

        // Restaurar la pieza capturada
        capturedCell.setPiece(lastMove.capturedPiece)
        this.game.board.pieces.push(lastMove.capturedPiece)

        // Ajustar score
        this.game.score -= 10

        this.helpUsed.undo++

        return {
            success: true,
            message: `Movimiento deshecho. Deshacer(s) restante(s): ${this.maxHelpsPerGame - this.helpUsed.undo}`
        }
    }

    // Activar modo de colocación libre
    toggleFreePlacement() {
        if (this.helpUsed.freePlacement >= this.maxHelpsPerGame) {
            return {
                success: false,
                message: `Ya usaste el máximo de colocación libre (${this.maxHelpsPerGame})`
            }
        }

        this.isFreePlacementActive = !this.isFreePlacementActive
        this.helpUsed.freePlacement++

        return {
            success: true,
            message: this.isFreePlacementActive
                ? "Modo colocación libre ACTIVADO. Coloca una ficha donde quieras (sin comer)."
                : "Modo colocación libre desactivado.",
            active: this.isFreePlacementActive
        }
    }

    // Obtener una pista de movimiento válido
    getHint() {
        if (this.helpUsed.hint >= this.maxHelpsPerGame) {
            return {
                success: false,
                message: `Ya usaste el máximo de pistas (${this.maxHelpsPerGame})`
            }
        }

        // Buscar un movimiento válido
        for (const piece of this.game.board.pieces) {
            const validMoves = this.game.board.getValidMovesForPiece(piece)
            if (validMoves.length > 0) {
                this.helpUsed.hint++
                return {
                    success: true,
                    message: `Pista: Mueve una ficha a (fila ${validMoves[0].row + 1}, columna ${validMoves[0].col + 1})`,
                    piece: piece,
                    targetCell: validMoves[0],
                    phasesLeft: this.maxHelpsPerGame - this.helpUsed.hint
                }
            }
        }

        return {
            success: false,
            message: "No hay movimientos válidos disponibles."
        }
    }

    // Obtener estado actual de ayudas
    getHelpStatus() {
        return {
            undo: {
                used: this.helpUsed.undo,
                remaining: this.maxHelpsPerGame - this.helpUsed.undo
            },
            freePlacement: {
                used: this.helpUsed.freePlacement,
                remaining: this.maxHelpsPerGame - this.helpUsed.freePlacement,
                active: this.isFreePlacementActive
            },
            hint: {
                used: this.helpUsed.hint,
                remaining: this.maxHelpsPerGame - this.helpUsed.hint
            }
        }
    }

    // Reiniciar ayudas
    reset() {
        this.moveHistory = []
        this.helpUsed = {
            undo: 0,
            freePlacement: 0,
            hint: 0
        }
        this.isFreePlacementActive = false
    }
}

window.HelpSystem = HelpSystem
