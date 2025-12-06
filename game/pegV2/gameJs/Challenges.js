// Desafíos predefinidos para el modo desafío del Peg Solitaire
// Cada desafío es una configuración de tablero con N fichas
// 1 = hay pieza, 0 = no hay pieza

class Challenges {
    static getChallenges() {
        return [
            {
                id: 1,
                name: "Principiante",
                difficulty: "Fácil",
                description: "Resuelve el tablero con 33 fichas",
                pieces: [
                    [0, 0, 1, 1, 1, 0, 0],
                    [0, 0, 1, 1, 1, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 0, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1],
                    [0, 0, 1, 1, 1, 0, 0],
                    [0, 0, 1, 1, 1, 0, 0],
                ]
            },
            {
                id: 2,
                name: "Intermedio",
                difficulty: "Medio",
                description: "Resuelve el tablero con 21 fichas",
                pieces: [
                    [0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 1, 1, 1, 0, 0],
                    [0, 1, 1, 1, 1, 1, 0],
                    [1, 1, 1, 0, 1, 1, 1],
                    [0, 1, 1, 1, 1, 1, 0],
                    [0, 0, 1, 1, 1, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0],
                ]
            },
            {
                id: 3,
                name: "Avanzado",
                difficulty: "Difícil",
                description: "Resuelve el tablero con 13 fichas",
                pieces: [
                    [0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 1, 0, 1, 0, 0],
                    [1, 1, 0, 0, 0, 1, 1],
                    [0, 0, 1, 0, 1, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0],
                ]
            },
            {
                id: 4,
                name: "Experto",
                difficulty: "Muy Difícil",
                description: "Resuelve el tablero con 9 fichas",
                pieces: [
                    [0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 1, 0, 0],
                    [1, 0, 0, 0, 0, 0, 1],
                    [0, 0, 1, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0],
                ]
            },
            {
                id: 5,
                name: "Casi Imposible",
                difficulty: "Legendario",
                description: "Resuelve el tablero con 5 fichas",
                pieces: [
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0],
                ]
            }
        ];
    }

    static getChallengeById(id) {
        const challenges = this.getChallenges();
        return challenges.find(challenge => challenge.id === id);
    }
}

window.Challenges = Challenges;
