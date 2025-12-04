class HintAnimation { // Maneja las animaciones para ubicar las fichas.
     
    constructor() {
        this.hints = [];
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
    }

    setHints(validCells) { // Establece que seldas deben estar animadas
        this.hints = validCells.map((cell) => ({
            cell: cell,
            alpha: 0,
            scale: 1,
        }))
    }

    clearHints() { // Limpia los hints
        this.hints = [];
    }

    update() {  // Actualiza la animacion
        this.animationFrame += this.animationSpeed;

        for (const hint of this.hints) {
            // Animación de pulsacion
            hint.alpha = 0.3 + Math.sin(this.animationFrame) * 0.3
            hint.scale = 1 + Math.sin(this.animationFrame) * 0.1
        }
    }

    draw(ctx) { // Renderiza los hints en el canvas
        for (const hint of this.hints) {
            const cell = hint.cell

            ctx.save()

            // Círculo pulsante
            ctx.globalAlpha = hint.alpha
            ctx.beginPath()
            ctx.arc(cell.x, 
                cell.y, 
                cell.radius * hint.scale, 
                0, 
                Math.PI * 2)
            ctx.fillStyle = "#26ee00"
            ctx.fill()
            ctx.strokeStyle = "#20c300"
            ctx.lineWidth = 3
            ctx.stroke()
            ctx.closePath()

            ctx.restore()
        }
    }

} 
window.HintAHintAnimation = HintAnimation; 
