class Cell { // Representa una celda individual en el tablero

    constructor(row, col, x, y, radius) {
        this.row = row
        this.col = col
        this.x = x // Posicion X en el canvas
        this.y = y // Posicion Y en el canvas
        this.radius = radius
        this.piece = null // Pieza que ocupa esta celda
        this.isValid = true // Valido para ubicarse en el tablero
    }

    containsPoint(x,y) { // Verifica si la celda contiene un punto
        const distance = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2))
        return distance <= this.radius        
    }

    isEmpty() { // Verifica si en la ccelda no hay una pieza
        return this.piece == null
    }

    hasPiece() { // Verifica si en la ccelda hay una pieza
        return this.piece !== null
    }

    setPiece(piece) { // Ubica una pieza en el tablero
        this.piece = piece
        if(piece) {
            piece.cell = this // Setea la celda de la pieza a esta celda
        }
    }

    removePiece() { // Remueve la piece de la celda y la devuelve
        const piece = this.piece
        this.piece = null
        return piece
    }

    draw(ctx, theme) { // Dibuja la celda en el canvas
        if (!this.isValid) {
            return;
        }

        ctx.beginPath();
        ctx.arc(
            this.x, 
            this.y,
            this.radius, 
            0, 
            Math.PI * 2);
        ctx.strokeStyle = theme ? theme.cellColor : "#3b3737ff"
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.closePath()
    }

    drawCenterCell(ctx, theme) { // Dibujo la celda del medio del tablero
        if (!this.isValid) {
            return;
        }

        ctx.beginPath();
        ctx.arc(
            this.x, 
            this.y, 
            this.radius, 
            0, 
            Math.PI * 2);
        const centerColor = theme ? theme.cellValidColor : "#767575ff"
        ctx.strokeStyle = centerColor
        ctx.lineWidth = 3
        ctx.fillStyle = centerColor
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }

} 

window.Cell = Cell;
