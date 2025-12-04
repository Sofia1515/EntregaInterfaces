class Piece {
    constructor(imgSrc) {
        this.cell = null;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.dragX = 0;
        this.dragY = 0;
        this.scale = 1;
        this.imageLoaded = false;
        
        // Cargo la imagen que recibo por parametro
        this.imageObj = new Image();
        this.imageObj.onload = () => {
            this.imageLoaded = true;
        };
        
        this.imageObj.onerror = () => {
            console.error("Error cargando imagen de pieza:", imgSrc);
        };
        
        this.imageObj.src = imgSrc;
    }

    startDrag(mouseX, mouseY) { // Comienza a arrastrarse la pieza
        this.isDragging = true;
        this.offsetX = mouseX - this.cell.x;
        this.offsetY = mouseY - this.cell.y;
        this.dragX = mouseX;
        this.dragY = mouseY;
        this.scale = 1.2;
    }

    updateDrag(mouseX, mouseY) { // Actualiza la posicion de la pieza durante el arrastre
        if(this.isDragging) {
            this.dragX = mouseX;
            this.dragY = mouseY;
        }
    }

    endDrag() { // Termina el drag de la pieza
        this.isDragging = false
        this.scale = 1;
    }

    containsPoint(x, y) { // Verifica si un punto esta sobre la pieza
        if (!this.cell) {
            return false;
        }

        const pieceX = this.isDragging ? this.dragX : this.cell.x
        const pieceY = this.isDragging ? this.dragY : this.cell.y
        const radius = this.cell.radius * 0.9

        const distance = Math.sqrt(Math.pow(x - pieceX, 2) + Math.pow(y - pieceY, 2))
        return distance <= radius
    }

    draw(ctx) { //Dibuja la pieza en el canvas
        if (!this.cell || !this.imageLoaded) {
            return;
        }

        const x = this.isDragging ? this.dragX : this.cell.x
        const y = this.isDragging ? this.dragY : this.cell.y
        const size = this.cell.radius * 2 * this.scale

        ctx.save()
        ctx.beginPath();
        ctx.arc(
            x, 
            y, 
            size / 2, 
            0, 
            Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
            this.imageObj, 
            x - size / 2, 
            y - size / 2, 
            size, 
            size)

        if (this.isDragging) { // Si la pieza esta siendo arrastrada se aplican una sombra debajo.
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
            ctx.shadowBlur = 15
            ctx.shadowOffsetX = 5
            ctx.shadowOffsetY = 5
        }

        ctx.restore();
    }

}

window.Piece = Piece;
