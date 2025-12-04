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

  if (controlsPopover) {
    closeControlsPopover();
    return;
  }

  // Crear fondo oscuro
  const overlay = document.createElement("div");
  overlay.id = "controls-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "-100";
  overlay.style.left = "-500";
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
          <p>Recolectar monedas pasando entre los tubos y eliminando enemigos.</p>
        </div>
      </div>
      <div class="control-item">
        <span class="control-icon">⌨️</span>
        <div>
          <strong>Espacio:</strong>
          <p>Saltar.</p>
        </div>
      </div>
      <div class="control-item">
        <span class="control-icon">⌨️</span>
        <div>
          <strong>F:</strong>
          <p>Disparar.</p>
        </div>
      </div>
    </div>
  `;

  // Posicionarlo arriba del botón
  const rect = controlButton.getBoundingClientRect();
  controlsPopover.style.position = "absolute";
  controlsPopover.style.left = rect.left - 50 + 'px';
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

const playButton = document.getElementById("play-button")
const gameCenterInfo = document.getElementById("game-center-info")
const gameExecution = document.getElementById("game-execution")

playButton.addEventListener("click", () => {
  gameCenterInfo.classList.add("hidden")
  gameCenterInfo.classList.remove("visible")
  gameExecution.classList.add("visible")
  gameExecution.classList.remove("hidden")

  iniciarJuego();
});

function iniciarJuego() {


}