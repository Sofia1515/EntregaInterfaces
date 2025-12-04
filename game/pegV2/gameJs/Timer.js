class Timer {
    
    constructor(limitInSeconds, onTimeUp) {
        this.limit = limitInSeconds
        this.remaining = limitInSeconds
        this.isRunning = false
        this.onTimeUp = onTimeUp
        this.intervalId = null
    }

    start() { // Inicia el tiempo
        if(this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.intervalId = setInterval(() => {
        this.remaining--;

           if (this.remaining <= 0) {
                this.stop()
                if (this.onTimeUp) {
                    this.onTimeUp()
                }
            }
        }, 1000)
    }

    stop() { 
        this.isRunning = false;
        if(this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reset() { // Reinicia el tiempo
        this.stop();
        this.remaining = this.limit;
    }

    getFormattedTime() { // Obtiene el tiempo en mintuos:segundos
        const minutes = Math.floor(this.remaining / 60)
        const seconds = this.remaining % 60
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    isRunningOut() { // Verifica si quedan menos de 30s
        return this.remaining <= 30;
    }
} 

window.Timer = Timer;
