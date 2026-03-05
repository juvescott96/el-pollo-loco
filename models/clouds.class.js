class Clouds extends MoveableObject {

    y = 25;
    height = 250;
    width = 350;

    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.speed = 0.01;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }


}

