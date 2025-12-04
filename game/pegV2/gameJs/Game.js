class Game {

  constructor(canvasId, pieceImageSrc) {
    this.canvas = document.getElementById(canvasId)

    if (!this.canvas) {
      return
    }

    this.ctx = this.canvas.getContext("2d")
    this.pieceImageSrc = pieceImageSrc

    this.backgroundImage = new Image()
    this.backgroundImage.src = "./images/gameImages/background2.png"
    this.backgroundImageLoaded = false
    this.backgroundImage.onload = () => {
      this.backgroundImageLoaded = true
      this.draw()
    }

    this.resizeCanvas()

    // Componentes del juego
    this.board = new Board(this.canvas, 25, this.backgroundImage.src)
    this.hintAnimation = new HintAnimation()
    this.timer = new Timer(300, () => this.gameOver("time")) // 5 minutos

    // Estado del juego
    this.selectedPiece = null
    this.gameState = "ready"
    this.score = 0

    this.setupEventListeners()

    this.initialize() 
  }

  resizeCanvas() {  // Ajusto el tamaño del canvas
    const container = this.canvas.parentElement
    const size = Math.min(container.clientWidth, container.clientHeight, 800)
    this.canvas.width = size
    this.canvas.height = size
  }

  initialize() { // Inicia el juego
    this.board.initializePieces(this.pieceImageSrc)
    this.gameState = "ready"
    this.score = 0
    this.selectedPiece = null
    this.hintAnimation.clearHints()
    this.timer.reset()
    this.draw()
  }

  start() { // Comienza el juego
    this.gameState = "playing"
    this.timer.start()
    this.gameLoop()
  }

  restart() { // Restart del juego. Reinicio valores.
    this.timer.stop()
    this.timer.reset()
    this.board.reset(this.pieceImageSrc)
    this.score = 0
    this.selectedPiece = null
    this.hintAnimation.clearHints()
    this.gameState = "playing"
    this.timer.start()
    this.gameLoop()
  }

  setupEventListeners() { // Preparo los eventListeners
    this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e))
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e))
    this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e))
    
    this.canvas.addEventListener("click", (event) => {
    const rect = this.canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if (
      this.restartButton &&
      x >= this.restartButton.x &&
      x <= this.restartButton.x + this.restartButton.width &&
      y >= this.restartButton.y &&
      y <= this.restartButton.y + this.restartButton.height
    ) {
      this.restart()
    }
  })

    window.addEventListener("resize", () => {
      this.resizeCanvas()
      this.board = new Board(this.canvas)
      this.board.initializePieces(this.pieceImageSrc)
      this.draw()
    })
  }

  getMousePosition(e) { // Toma la posicion del mouse
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  handleMouseDown(e) {
    if (this.gameState !== "playing") return

    const pos = this.getMousePosition(e)
    const piece = this.board.getPieceAtPosition(pos.x, pos.y)

    if (piece) {
      this.selectedPiece = piece
      piece.startDrag(pos.x, pos.y)

      // Mostrar hints de movimientos válidos
      const validMoves = this.board.getValidMovesForPiece(piece)
      this.hintAnimation.setHints(validMoves)
    }
  }

  handleMouseMove(e) {
    if (this.gameState !== "playing") return

    const pos = this.getMousePosition(e)

    if (this.selectedPiece && this.selectedPiece.isDragging) {
      this.selectedPiece.updateDrag(pos.x, pos.y)
    }
  }

  handleMouseUp(e) {
    if (this.gameState !== "playing" || !this.selectedPiece) return

    const pos = this.getMousePosition(e)
    const targetCell = this.board.getCellAtPosition(pos.x, pos.y)

    if (targetCell && this.board.isValidMove(this.selectedPiece.cell, targetCell)) {
      // Movimiento válido
      this.board.executeMove(this.selectedPiece, targetCell)
      this.score += 10

      // Verificar si el juego terminó
      if (!this.board.hasValidMoves()) {
        this.gameOver("no-moves")
      }
    }

    // Finalizar arrastre
    this.selectedPiece.endDrag()
    this.selectedPiece = null
    this.hintAnimation.clearHints()
  }

  gameOver(reason) { // Muesta mensaje al terminar el juego
    this.gameState = "finished";
    this.timer.stop();

    const remaining = this.board.getRemainingPieces();
    let title = "";
    let message = "";

    if (reason === "time") {
      title = "¡Se te agoto el tiempo!";
      message = `Piezas restantes: ${remaining}<br>Score: ${this.score}`;
    } else if (reason === "no-moves") {
      if (remaining === 1) {
        title = "¡Salvaste la ciudad!";
        message = `¡Ganaste con solo 1 pieza restante!<br>Score: ${this.score}`;
      } else {
        title = "¡Juego terminado!";
        message = `Piezas restantes: ${remaining}<br>Score: ${this.score}`;
      }
    }

    // Mostrar panel personalizado
    const panel = document.getElementById("game-over-panel");
    const titleElem = document.getElementById("game-over-title");
    const messageElem = document.getElementById("game-over-message");
    const restartBtn = document.getElementById("restart-btn");

    titleElem.innerHTML = title;
    messageElem.innerHTML = message;
    panel.classList.remove("hidden");

    restartBtn.onclick = () => {
      panel.classList.add("hidden");
      this.restart();
    };
  }

  gameLoop() {
    if (this.gameState !== "playing") return

    this.update()
    this.draw()

    requestAnimationFrame(() => this.gameLoop())
  }

  update() {
    this.hintAnimation.update()
  }

  draw() { // Dibuja en el canvas
    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Dibujar tablero
    this.board.draw()

    // Dibujar hints
    this.hintAnimation.draw(this.ctx)

    // Dibujar UI
    this.drawUI()
  }

  drawUI() { // Dibuja interfaz de usuario
    const padding = 20

    // Timer
    this.ctx.font = 'bold 24px "JetBrains Mono", monospace'
    this.ctx.fillStyle = this.timer.isRunningOut() ? "#ff0000" : "#ffffffff"
    this.ctx.fillText(`Tiempo: ${this.timer.getFormattedTime()}`, padding, padding + 24)

    // Piezas restantes
    this.ctx.fillStyle = "#ffffffff"
    this.ctx.fillText(`Piezas: ${this.board.getRemainingPieces()}`, padding, padding + 54)

    // Score
    this.ctx.fillText(`Score: ${this.score}`, padding, padding + 84)

    // Boton de reiniciar
    const buttonX = this.canvas.width - 150
    const buttonY = this.canvas.height - 60
    const buttonWidth = 130
    const buttonHeight = 40

    this.ctx.fillStyle = "#4444ff"
    this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight)
    this.ctx.fillStyle = "#ffffff"
    this.ctx.font = 'bold 20px "JetBrains Mono", monospace'
    this.ctx.fillText("Reiniciar", buttonX + 10, buttonY + 26)
    this.restartButton = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight }
  }

}

window.Game = Game;
