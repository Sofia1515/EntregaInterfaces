/*==== Abrir y cerrar paneles laterales===== */

const hamburguerBtn = document.getElementById("hamburguer-button")
const configBtn = document.getElementById("config-button")
const hamburguerSection = document.querySelector(".hamburguer-section")
const configSection = document.querySelector(".config-section")
const mainContent = document.querySelector("main")

function updateMainLayout() {
  const leftVisible = !hamburguerSection.classList.contains("hamburguer-hidden")
  const rightVisible = !configSection.classList.contains("config-hidden")

  mainContent.classList.remove("expand-left", "expand-right", "expand-none", "expand-both")

  if (!leftVisible && !rightVisible) {
    mainContent.classList.add("expand-none")
  } else if (!leftVisible && rightVisible) {
    mainContent.classList.add("expand-right")
  } else if (leftVisible && !rightVisible) {
    mainContent.classList.add("expand-left")
  } else if (leftVisible && rightVisible) {
    mainContent.classList.add("expand-both")
  }
}

hamburguerBtn.addEventListener("click", () => {
  hamburguerSection.classList.toggle("hamburguer-hidden")
  updateMainLayout()
})

configBtn.addEventListener("click", () => {
  configSection.classList.toggle("config-hidden")
  updateMainLayout()
})

updateMainLayout()

const fullscreenButton = document.getElementById("button-fullScreen")

// Entra en fullscreen
fullscreenButton.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
    })
  } else {
    document.exitFullscreen().catch((err) => {
      console.error("Error al intentar salir de fullscreen:", err)
    })
  }
})

//Abrir controles del juego
let controlsPopover = null;

const controlButton = document.getElementById("button-controls");
const controlsContainer = document.querySelector(".game-buttons-section"); // el contenedor donde está el botón

controlButton.addEventListener("click", (e) => {
  e.stopPropagation();

  // Si ya está abierto, cerrarlo
  if (controlsPopover) {
    closeControlsPopover();
    return;
  }

  // Crear fondo oscuro
  const overlay = document.createElement("div");
  overlay.id = "controls-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
  overlay.style.zIndex = "900";
  document.body.appendChild(overlay);

  // Crear popover
  controlsPopover = document.createElement("div");
  controlsPopover.className = "controls-popover";
  controlsPopover.innerHTML = `
    <div class="controls-popover-header">
      <h3>Cómo Jugar</h3>
      <button class="controls-close-btn">&times;</button>
    </div>
    <div class="controls-popover-content">
      <div class="control-item">
        <span class="control-icon">🎯</span>
        <div>
          <strong>Objetivo:</strong>
          <p>Comé fichas saltando sobre ellas y terminá con solo una pieza en el centro para ganar.</p>
        </div>
      </div>
      <div class="control-item">
        <span class="control-icon">🖱️</span>
        <div>
          <strong>Click Izquierdo:</strong>
          <p>Mantené y arrastrá una pieza al casillero que elijas.</p>
        </div>
      </div>
    </div>
  `;

  // Posicionarlo arriba del botón
  const rect = controlButton.getBoundingClientRect();
  controlsPopover.style.position = "absolute";
  controlsPopover.style.left = `${rect.left}px`;
  controlsPopover.style.top = `${rect.top - 200}px`; // altura aproximada arriba del botón
  controlsPopover.style.zIndex = "1000";

  document.body.appendChild(controlsPopover);

  // Cerrar con botón
  controlsPopover.querySelector(".controls-close-btn").addEventListener("click", closeControlsPopover);

  // Cerrar al click fuera
  overlay.addEventListener("click", closeControlsPopover);
});

function closeControlsPopover() {
  if (controlsPopover) {
    controlsPopover.remove();
    controlsPopover = null;
  }
  const overlay = document.getElementById("controls-overlay");
  if (overlay) overlay.remove();
}

/*====== Logica del Juego ===== */

// Variables globales
let game = null;
let isGameRunning = false;
let selectedPieceSrc = null;

document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.querySelector(".play-button");
  const gameCenterInfo = document.getElementById("game-center-info");
  const gameExecution = document.getElementById("game-execution");
  const sectionSelectPieceImg = document.getElementById("game-SelectPieceImg");

  // Boton de jugar
  playButton.addEventListener("click", () => {
    gameCenterInfo.classList.add("hidden");

    sectionSelectPieceImg.classList.remove("hidden");
    sectionSelectPieceImg.classList.add("visible");

    selectPieceImg();
  });

  function selectPieceImg() {
    const pieceImagesSrc = [
      "./images/gameImages/fichaBatman1.jpg",
      "./images/gameImages/fichaBatman2.jpg",
      "./images/gameImages/fichaBatman3.jpg",
      "./images/gameImages/fichaBatman4.jpg",
    ];

    const showPiecesImg = document.querySelector(".showPiecesImg");
    showPiecesImg.innerHTML = "";

    // Mostrar las imágenes
    pieceImagesSrc.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Piece image";
      img.classList.add("pieceImg");
      showPiecesImg.appendChild(img);

      img.addEventListener("click", () => {
        selectedPieceSrc = src;

          sectionSelectPieceImg.classList.remove("visible");
          sectionSelectPieceImg.classList.add("hidden");

          gameExecution.classList.remove("hidden");
          gameExecution.classList.add("visible");

          initializeGame(selectedPieceSrc);
      });
    });
  }

  function initializeGame(pieceImgSrc) {
    loadGameClasses() // Cargo las clases y luego se inicia el juego.
      .then(() => {
        const game = new window.Game("myCanvas", pieceImgSrc); // paso URL
        game.start();
    });
  }

  async function loadGameClasses() {
    const scripts = [
      "./gameJs/Board.js",
      "./gameJs/Cell.js",
      "./gameJs/Game.js",
      "./gameJs/HintAnimation.js",
      "./gameJs/Piece.js",
      "./gameJs/Timer.js"
    ];

    return Promise.all(
      scripts.map(src => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = () => reject(`Error loading ${src}`);
          document.head.appendChild(script);
        });
      })
    );
  }

});