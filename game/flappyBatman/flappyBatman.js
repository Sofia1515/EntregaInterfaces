const spaceship = document.getElementById("spaceship");
const propulsores = document.getElementById("propulsores");
const juego = document.getElementById("game-execution");
const conteinerTuberias = document.getElementById("conteiner-tuberias");
const divDerrota = document.getElementById("div-derrota");
const btnJugarDeNuevo = document.getElementById("btn-jugar-de-nuevo");
const mensajeInicio = document.getElementById("div-mensaje-inicio");
const contadorCoins = document.querySelectorAll(".coin-counter");


// Variables globales
let jugando = false;
let coinsAgarradas = 0;
let esperandoInicio = true; 

// Variables de la nave
let posX = 10;
let posY = 250;
let velocidadY = 0;
const gravedad = 0.5;
const impulso = -8;
const naveWidth = 280;
const naveHeight = 105;

// Variables de las tuberias
let arrTuberias = [];
let espacioEntreTuberias = 130;
let anchoTuberia = 300;
let velocidadTuberias = 5;
let intervaloGeneracionTuberias;

// Variables de las moneda
let arrCoins = [];
let coinWidth = 172;
let coinHeight = 200;
let probabilidadSpawnCoin = 0.3;
let auxCoinPosX = 50;
let auxCoinPosY = -30;

// Variables de los cohetes enewmigos
let arrCohetes = [];
let coheteWidth = 168;
let coheteHeight = 353;
let probabilidadSpawnCohete = 0.7;

// Variables de los disparos
let arrDisparos = [];
let disparoWidth = 211;
let disparoHeight = 92;
let tiempoEntreDisparoso = 1;
let velocidadDisparo = 10;

// Medidas del contenedor del juego
let maxY;
let minY;
let maxX;
let minX;

// Variables de control
let idAnimacion;

// Sonidos
let sonidoDisparo;
let sonidoExplosion;
let sonidoCoin;
let sonidoVictoria;
let sonidoWin;

/*===== Logica =====*/

document.getElementById("play-button").addEventListener("click", () => { // Comienza el juego.
    obtenerLimites();
    posY = maxY * 0.5;
    actualizarPosicion();
    
    document.getElementById("game-center-info").classList.add("hidden");
    mensajeInicio.style.display = 'block';
    esperandoInicio = true;
});

btnJugarDeNuevo.addEventListener("click", reiniciarJuego);
function reiniciarJuego() { // Reinicia el juego.
    divDerrota.classList.add("hidden");

    const divVictoria = document.querySelector('.div-victoria');
    if (divVictoria) {
        divVictoria.remove();
    }

    spaceship.classList.add("spaceship");
    spaceship.classList.remove("hidden");
    propulsores.classList.remove("hidden");

    const coinCounters = document.querySelectorAll('.coin-counter');
    coinCounters.forEach(coin => {
        coin.classList.remove('activa');
    });

    // Reinicio las variables del juego
    limpiarEscenario();
    obtenerLimites();
    posY = maxY * 0.5;
    velocidadY = 0;
    coinsAgarradas = 0;
    actualizarPosicion();
    
    mensajeInicio.style.display = 'block';
    mensajeInicio.style.opacity = '1';
    mensajeInicio.classList.remove("hidden");
    esperandoInicio = true;
    
    propulsores.classList.remove("propulsores-high");
    propulsores.classList.add("propulsores-low");
}

function iniciarConEspacio() { // Inicio el juego al apretar espacio.
    if (!esperandoInicio) return;
    
    esperandoInicio = false;
    jugando = true;
    document.body.classList.remove("paused");
    
    mensajeInicio.style.transition = 'opacity 0.5s';
    mensajeInicio.style.opacity = '0';
    setTimeout(() => { // Luego de 0.5s desaparece
        mensajeInicio.style.display = 'none';
    }, 500);
    
    obtenerLimites();
    posY = maxY * 0.5; // Ubico la nave en la mitad
    velocidadY = 0;
    
    intervaloGeneracionTuberias = setInterval(spawnTuberias, 3000); // Cada 3s genera tuberias
    idAnimacion = requestAnimationFrame(actualizarJuego);
}

//Cómo funciona la gravedad y el movimiento vertical de la nave

function actualizarJuego() { // Actualiza posY de la nave y chequea si choca.
    if (!jugando) return;
    
    moverEscenario();
    moverDisparos();
    verificarColisionCoins();
    verificarColisionDisparos();

    velocidadY += gravedad; // La gravedad que con cada salto vale -8 va incremetando en 0.5
    posY += velocidadY; // Se actualiza la posY segun lo que valga velocidad. Va bajando.
    
    if (posY < minY || posY > maxY || verificarColisionTuberias() ||  verificarColisionCohetes()) { // Si choca arriba, abajo, con las tuberias o con el cohete.
        spaceship.classList.add("hidden");
        propulsores.classList.add("hidden");
        crearExplosion(posX, posY);
        gameOver();
    }
    
    actualizarPosicion();
    idAnimacion = requestAnimationFrame(actualizarJuego);
}

function verificarColisionTuberias() { // Verifica si choca con las tuberias.
    for (const tuberia of arrTuberias) {
        if (posX < tuberia.x + anchoTuberia && posX + naveWidth > tuberia.x) {

            const chocaArriba = posY < tuberia.huecoY;
            const chocaAbajo = posY > tuberia.huecoY + espacioEntreTuberias;
            
            if (chocaArriba || chocaAbajo) {
                return true;
            }
        }
    }
    return false;
}

function verificarColisionCoins() { // Verifica si agarra la moneda.
    for (let i = arrCoins.length - 1; i >= 0; i--) {
        const coin = arrCoins[i];
        
        if (!coin.collected && 
            posX < coin.x + coinWidth &&
            posX + naveWidth > coin.x &&
            posY < coin.y + coinHeight &&
            posY + naveHeight > coin.y) {
            
            repoducirSonidoCoin();
            coin.collected = true;
            coinsAgarradas++;
            coin.element.remove();
            arrCoins.splice(i, 1);
            
            actualizarContadorCoins();
        }
    }
}

function verificarColisionCohetes() { // Verifica si choca con el cohete.
    for (let i = arrCohetes.length - 1; i >= 0; i--) {
        const cohete = arrCohetes[i];
        
        if (cohete.active &&
            posX < cohete.x + coheteWidth &&
            posX + naveWidth > cohete.x &&
            posY < cohete.y + coheteHeight &&
            posY + naveHeight > cohete.y) {
                
            crearExplosion(cohete.x, cohete.y);
            cohete.element.remove();
            return true;
        }
    }
}

function actualizarContadorCoins() { // Actualiza el contador de monedas.
    contadorCoins.forEach((coin, index) => {
        if (index < coinsAgarradas) {
            coin.classList.add('activa');
        } else {
            coin.classList.remove('activa');
        }
    });
    
    if (coinsAgarradas >= 3) {
        mostrarVictoria();
        detenerParallax();
    }
}

function spawnTuberias() { // Crea un las tuberas con la moneda o el cohete.
    if (!jugando) return;

    const parTuberias = document.createElement('div');
    parTuberias.className = 'par-tuberias';
    
    const spawnX = maxX; // Para que venga de afuera
    parTuberias.style.left = spawnX + 'px';
    
    const minHuecoY = maxY * 0.2;  // 20% del alto
    const maxHuecoY = maxY * 0.7;  // 70% del alto
    const huecoY = Math.random() * (maxHuecoY - minHuecoY) + minHuecoY;
    
    // Tuberia SUPERIOR
    const tuberiaArriba = document.createElement('div');
    tuberiaArriba.className = 'tuberia arriba';
    tuberiaArriba.style.height = huecoY + 'px'; // Altura desde top hasta hueco
    tuberiaArriba.style.left = '0px';
    
    // Tuberia INFERIOR  
    const alturaTuberiaAbajo = maxY - (huecoY + espacioEntreTuberias);
    const tuberiaAbajo = document.createElement('div');
    tuberiaAbajo.className = 'tuberia abajo';
    tuberiaAbajo.style.height = Math.max(0, alturaTuberiaAbajo) + 'px'; // Evita altura negativa
    tuberiaAbajo.style.left = '0px';
    
    parTuberias.appendChild(tuberiaArriba);
    parTuberias.appendChild(tuberiaAbajo);
    conteinerTuberias.appendChild(parTuberias);
    
    const tuberiaObj = { // Info de la tuberia
        element: parTuberias,
        x: spawnX,
        huecoY: huecoY,
        ancho: anchoTuberia,
    };
    
    arrTuberias.push(tuberiaObj);
    generarObjetoEntreMedio(spawnX, huecoY, espacioEntreTuberias);

    return tuberiaObj;
}

function generarObjetoEntreMedio(spawnX, huecoY, espacioEntreTuberias) {  // Genera una moneda/cohete entre las tuberias
    const random = Math.random();

    const posYObjeto = huecoY + (espacioEntreTuberias / 2);

    if (random < probabilidadSpawnCoin) {
        crearCoin(spawnX + auxCoinPosX, posYObjeto + auxCoinPosY);
    }else if (random < probabilidadSpawnCohete) {
        crearCoheteEnemigo(spawnX, posYObjeto);
    }
}

function crearCoin(x, y) { // Crea una moneda entre las tuberias.
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.style.left = x + 'px';
    coin.style.top = y + 'px';
    
    juego.appendChild(coin);
    
    const coinObj = {
        element: coin,
        x: x,
        y: y,
        width: coinWidth,
        height: coinHeight,
        collected: false
    };
    
    arrCoins.push(coinObj);
    return coinObj;
}

function crearCoheteEnemigo(x, y) { // Crea un cohete entre las tuberias.
    const cohete = document.createElement('div');
    cohete.className = 'cohete-enemigo';
    cohete.style.left = x + 'px';
    cohete.style.top = y + 'px';

    juego.appendChild(cohete);
    
    const coheteObj = {
        element: cohete,
        x: x,
        y: y,
        width: coheteWidth,
        height: coheteHeight,
        active: true
    };
    
    arrCohetes.push(coheteObj);
    return coheteObj;
}

function crearExplosion(x,y) { // Crea una explosion donde choca la nave.
    const explosion = document.createElement('div');
    explosion.className = 'explosion';

    const explosionX = x - 50;
    const explosionY = y - 120;

    explosion.style.left = explosionX + "px";
    explosion.style.top = explosionY + "px";

    repoducirSonidoExplosion();
    juego.appendChild(explosion);
    
    setTimeout(() => {
        explosion.remove();
    }, 1000);
}

function moverEscenario() { // Corre las tuberias, monedas y cohetes para la izquierda.
    // Mover tuberias 
    for (let i = arrTuberias.length - 1; i >= 0; i--) {
        const tuberia = arrTuberias[i];
        
        tuberia.x -= velocidadTuberias;
        tuberia.element.style.left = tuberia.x + 'px';
        
        if (tuberia.x < -anchoTuberia) { // Si sale de la pantalla la elimina
            tuberia.element.remove();
            arrTuberias.splice(i, 1);
        }
    }

    // Mover monedas 
    for (let i = arrCoins.length - 1; i >= 0; i--) {
        const coin = arrCoins[i];
        
        coin.x -= velocidadTuberias;
        coin.element.style.left = coin.x + 'px';
        
        if (coin.x < -coinWidth) {
            coin.element.remove();
            arrCoins.splice(i, 1);
        }
    }
    
    // Mover cohetes enemigos
    for (let i = arrCohetes.length - 1; i >= 0; i--) {
        const cohete = arrCohetes[i];
        
        cohete.x -= velocidadTuberias;
        cohete.element.style.left = cohete.x + 'px';
        
        if (cohete.x < -coheteWidth) {
            cohete.element.remove();
            arrCohetes.splice(i, 1);
        }
    }
}

function limpiarEscenario() { // Limpia el escenario.
    clearInterval(intervaloGeneracionTuberias);

    // Limpia tuberias.
    arrTuberias.forEach(tuberia => {
        tuberia.element.remove();
    });
    arrTuberias = [];

    // Limpia cohetes.
    arrCohetes.forEach(cohete => {
        cohete.element.remove();
    });
    arrCohetes = [];

    // Limpia monedas.
    arrCoins.forEach(coin => {
        coin.element.remove();
    });
    arrCoins = [];

    // Limpia disparos.
    arrDisparos.forEach(disparo => {
        disparo.element.remove();
    });
    arrDisparos = [];
}


//evento para saltar y disparar
document.addEventListener("keydown", (e) => {
    /*Salto con SPACE o con ENTER
    if ((e.code === "Space" || e.code === "Enter") && jugando) {
        e.preventDefault();
        velocidadY = impulso;  // La nave se impulsa hacia arriba
    }*/
    
    // Presiona f para disparar.
    if (e.code === "KeyF" && jugando) {
        e.preventDefault();
    disparar(posX, posY);
    }
})

function disparar(x, y) { // Crea un disparo que sale desde la punta de la naave.
    const disparo = document.createElement('div');
    disparo.className = "disparo";
    disparo.style.left = (x + naveWidth - 50) + 'px';
    disparo.style.top = (y + 10) + 'px';
    juego.appendChild(disparo);

    const disparoObj = {
        element: disparo,
        x: x + naveWidth - 50,
        y: y + naveHeight / 2,
        width: disparoWidth,
        height: disparoHeight,
        active: true
    };

    repoducirSonidoDisparo();
    arrDisparos.push(disparoObj);
    return disparoObj;
}

function moverDisparos() { // Mueve los disparos a una velocidad constante.
    for (let i = arrDisparos.length - 1; i >= 0; i--) {
        const disparo = arrDisparos[i];

        disparo.x += velocidadDisparo;
        disparo.element.style.left = disparo.x + 'px';

        if (disparo.x > maxX) {
            disparo.element.remove();
            arrDisparos.splice(i,1);
        }
    }
}

function verificarColisionDisparos() { // Chequea colisionde los disparos con los cohetes.
    for (let i = arrDisparos.length - 1; i >= 0; i--) {
        const disparo = arrDisparos[i];
        
        for (let j = arrCohetes.length - 1; j >= 0; j--) {
            const cohete = arrCohetes[j];
            
            if (cohete.active &&
                disparo.x < cohete.x + coheteWidth &&
                disparo.x + disparoWidth > cohete.x &&
                disparo.y < cohete.y + coheteHeight &&
                disparo.y + disparoHeight > cohete.y) {
                
                crearExplosion(cohete.x, cohete.y);
                cohete.element.remove();
                arrCohetes.splice(j, 1);
                
                disparo.element.remove();
                arrDisparos.splice(i, 1);
                break; // Sale del loop
            }
        }
    }
}

function detenerParallax() { // Freno las animaciones.
    document.body.classList.add("paused");
}


//impulsar la nave
function elevarNave() { // Eleva la nave.
    if (!jugando) return;
    
    velocidadY = impulso;
    propulsores.classList.remove("propulsores-low");
    propulsores.classList.add("propulsores-high");
     
    setTimeout(() => { // Despues de 1s se cambia la animacion.
        propulsores.classList.remove("propulsores-high");
        propulsores.classList.add("propulsores-low");
    }, 1000);
}

function gameOver() { // Muestra el div de derrota y frena las animaciones.
    jugando = false;
    esperandoInicio = false;
    detenerParallax();
    setTimeout(() => {
        divDerrota.classList.remove("hidden");
    }, 1000);
    cancelAnimationFrame(idAnimacion);
    clearInterval(intervaloGeneracionTuberias);
}

function mostrarVictoria() { // Muesta el div de victoria y frena las animaciones.
    const divVictoria = document.createElement('div');
    divVictoria.className = 'div-victoria';
    divVictoria.innerHTML = `
        <h2>Ganaste!</h2>
        <p>Recolectaste todas las monedas</p>
        <button onclick="reiniciarJuego()">Jugar de nuevo</button>
    `;
    juego.appendChild(divVictoria);
    repoducirSonidoWin();

    jugando = false;
    clearInterval(intervaloGeneracionTuberias);
    cancelAnimationFrame(idAnimacion);
}

function obtenerLimites() { // Obtiene los limites del juego.
    const rect = juego.getBoundingClientRect(); // Devuelve las medidas del div del juego.
    minX = 0;
    maxX = rect.width;
    minY = 0;
    maxY = rect.height - naveHeight;
}

function actualizarPosicion() { // Actualiza de la nave en el eje Y.
    spaceship.style.top = posY + "px";
    propulsores.style.top = (posY + 38) + "px"; // 38px extra para alinear los propulsores
}

function iniciarSonidos() { // Inicia los sonidos.
    sonidoDisparo = new Audio("./assetpack/audios/disparo.mp3");
    sonidoDisparo.preload = "auto";
    sonidoDisparo.volume = 0.3;

    sonidoExplosion = new Audio("./assetpack/audios/explosion.mp3");
    sonidoExplosion.preload = "auto";
    sonidoExplosion.volume = 0.5;

    sonidoCoin = new Audio("./assetpack/audios/pickCoin.mp3");
    sonidoCoin.preload = "auto";
    sonidoCoin.volume = 0.5;

    sonidoWin = new Audio("./assetpack/audios/win.mp3");
    sonidoWin.preload = "auto";
    sonidoWin.volume = 1;
}

function repoducirSonidoExplosion() { // Reproduce sonido al explotar.
    if (sonidoExplosion) {
        sonidoExplosion.currentTime = 0; // Reiniciar
        sonidoExplosion.play().catch(error => {
            console.log("Audio no pudo reproducirse:", error);
        });
    }
}

function repoducirSonidoDisparo() { // Reproduce sonido al disparar.
    if (sonidoDisparo) {
        sonidoDisparo.currentTime = 0; // Reiniciar
        sonidoDisparo.play().catch(error => {
            console.log("Audio no pudo reproducirse:", error);
        });
    }
}

function repoducirSonidoCoin() { // Reproduce sonido al agarrar una moneda.
    if (sonidoCoin) {
        sonidoCoin.currentTime = 0; // Reiniciar
        sonidoCoin.play().catch(error => {
            console.log("Audio no pudo reproducirse:", error);
        });
    }
}

function repoducirSonidoWin() { // Reproduce sonido de victoria.
    if (sonidoWin) {
        sonidoWin.currentTime = 0; // Reiniciar
        sonidoWin.play().catch(error => {
            console.log("Audio no pudo reproducirse:", error);
        });
    }
}

document.addEventListener("keydown", (event) => { // Espacio para elever/iniciar. "F" para disparar.
    if (event.code === "Space") {
        event.preventDefault();
        
        if (esperandoInicio) { // Si no comenzo el juego se inicia al apretar espacio
            mensajeInicio.classList.add("hidden");
            iniciarConEspacio();
            elevarNave();
        } else if (jugando) {
            elevarNave();
        }
    }
});

window.addEventListener('load', function() { // Espera que cargue la pagina y obtiene los limites.
    obtenerLimites();
    iniciarSonidos();
});

window.addEventListener('resize', obtenerLimites); // Si hay resize obtiene los limites nuevamente.