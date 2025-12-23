class Clouds extends MoveableObjects {

    y = 25;
    height = 250;
    width = 350;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;

    }
}

