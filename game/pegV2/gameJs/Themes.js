// Sistema de temáticas para Peg Solitaire

class Themes {
    static getThemes() {
        return [
            {
                id: "classic",
                name: "Clásico",
                description: "Estilo tradicional con fichas rojas",
                cellColor: "#4a4a4a",
                cellBorderColor: "#333333",
                cellValidColor: "#6b6b6b",
                cellHoverColor: "#7d7d7d",
                pieceColor: "#ff4444",
                pieceBorderColor: "#cc0000",
                backgroundColor: "#2c2a2c",
                centerCellColor: "#3a3a3a",
                hintColor: "#ffff00"
            },
            {
                id: "neon",
                name: "Neón",
                description: "Estilo cyberpunk con colores vibrantes",
                cellColor: "#0a0e27",
                cellBorderColor: "#00ff00",
                cellValidColor: "#1a1e47",
                cellHoverColor: "#2a2e67",
                pieceColor: "#00ffff",
                pieceBorderColor: "#00aa88",
                backgroundColor: "#0d0d1f",
                centerCellColor: "#050510",
                hintColor: "#ff00ff"
            },
            {
                id: "ocean",
                name: "Océano",
                description: "Colores azules y marinos",
                cellColor: "#1e3a4c",
                cellBorderColor: "#0d1f2d",
                cellValidColor: "#2a4a5c",
                cellHoverColor: "#3a5a7c",
                pieceColor: "#4da6ff",
                pieceBorderColor: "#0066cc",
                backgroundColor: "#0a1525",
                centerCellColor: "#051020",
                hintColor: "#ffff00"
            },
            {
                id: "forest",
                name: "Bosque",
                description: "Colores verdes naturales",
                cellColor: "#2d4a2a",
                cellBorderColor: "#1d3a1a",
                cellValidColor: "#3d6a3a",
                cellHoverColor: "#4d8a4a",
                pieceColor: "#66dd66",
                pieceBorderColor: "#228822",
                backgroundColor: "#1a2a18",
                centerCellColor: "#0d1d0b",
                hintColor: "#ffff00"
            },
            {
                id: "sunset",
                name: "Atardecer",
                description: "Colores cálidos de atardecer",
                cellColor: "#4a3a2a",
                cellBorderColor: "#3a2a1a",
                cellValidColor: "#6a5a4a",
                cellHoverColor: "#7a6a5a",
                pieceColor: "#ff8844",
                pieceBorderColor: "#dd5500",
                backgroundColor: "#2a1a10",
                centerCellColor: "#1a0a00",
                hintColor: "#ffff00"
            },
            {
                id: "royal",
                name: "Real",
                description: "Colores púrpura y dorados",
                cellColor: "#3a2a4a",
                cellBorderColor: "#2a1a3a",
                cellValidColor: "#5a3a7a",
                cellHoverColor: "#6a4a9a",
                pieceColor: "#dd88ff",
                pieceBorderColor: "#aa00ff",
                backgroundColor: "#1a0a2a",
                centerCellColor: "#0d0515",
                hintColor: "#ffdd00"
            }
        ];
    }

    static getThemeById(id) {
        const themes = this.getThemes();
        return themes.find(theme => theme.id === id) || themes[0]; // Default: classic
    }

    static applyTheme(theme, canvas, ctx) {
        // Retorna el objeto tema para que se use en el drawing
        return theme;
    }
}

window.Themes = Themes;
