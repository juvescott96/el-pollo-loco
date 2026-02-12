class Clouds extends MoveableObjects {

    y = 25;
    height = 250;
    width = 350;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = 100 + Math.random() * 2200;
        this.speed = 0.05 + Math.random() * 0.1;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }


}

