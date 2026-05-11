class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    constructor() {
        this.keyPressEvents();

    }

    keyPressEvents() {
        window.addEventListener('keydown', (e) => {
            if (e.keyCode == 39) {
                this.RIGHT = true;
            }
            if (e.keyCode == 37) {
                this.LEFT = true;
            }
            if (e.keyCode == 38) {
                this.UP = true;
            }
            if (e.keyCode == 40) {
                this.DOWN = true;
            }
            if (e.keyCode == 32) {
                e.preventDefault();
                this.SPACE = true;
            }
            if (e.keyCode == 68) {
                this.D = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.keyCode == 39) {
                this.RIGHT = false;
            }
            if (e.keyCode == 37) {
                this.LEFT = false;
            }
            if (e.keyCode == 38) {
                this.UP = false;
            }
            if (e.keyCode == 40) {
                this.DOWN = false;
            }
            if (e.keyCode == 32) {
                this.SPACE = false;
            }
            if (e.keyCode == 68) {
                this.D = false;
            }
        });
    }

    btnPressEvents() {
        document.getElementById('btnLeft').addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.LEFT = true;
        });
        document.getElementById('btnLeft').addEventListener('pointerup', () => {
            this.LEFT = false;
        });
        document.getElementById('btnLeft').addEventListener('pointerleave', () => {
            this.LEFT = false;
        });

        document.getElementById('btnRight').addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.RIGHT = true;
        });
        document.getElementById('btnRight').addEventListener('pointerup', () => {
            this.RIGHT = false;
        });
        document.getElementById('btnRight').addEventListener('pointerleave', () => {
            this.RIGHT = false;
        });

        document.getElementById('jumpBtn').addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.SPACE = true;
        });
        document.getElementById('jumpBtn').addEventListener('pointerup', () => {
            this.SPACE = false;
        });
        document.getElementById('jumpBtn').addEventListener('pointerleave', () => {
            this.SPACE = false;
        });

        document.getElementById('throwBtn').addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.D = true;
        });
        document.getElementById('throwBtn').addEventListener('pointerup', () => {
            this.D = false;
        });
        document.getElementById('throwBtn').addEventListener('pointerleave', () => {
            this.D = false;
        });

        document.getElementById('btnLeft').addEventListener('contextmenu', (e) => e.preventDefault());
        document.getElementById('btnRight').addEventListener('contextmenu', (e) => e.preventDefault());
        document.getElementById('jumpBtn').addEventListener('contextmenu', (e) => e.preventDefault());
        document.getElementById('throwBtn').addEventListener('contextmenu', (e) => e.preventDefault());
    }

    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
        this.D = false;
    }
}
