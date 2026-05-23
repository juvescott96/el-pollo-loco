class Clouds extends MoveableObject {

    y = 25;
    height = 250;
    width = 350;

    /**
     * Creates a cloud.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.speed = 0.01;
        this.animate();
    }

    /**
     * Moves the cloud slowly to the left.
     */
    animate() {
        setInterval(() => {
            if (this.world && this.world.isPaused) return;
            this.moveLeft();
        }, 1000 / 60);
    }


}
