class Coins extends MoveableObjects {


    IMAGES_WALKING = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png',
    ];
    currentImage = 0;

    constructor(x) {
        super().loadImage('img/8_coin/coin_1.png');
        this.x = 400 + Math.random() * 2200;
        this.y = 10 + Math.random() * 220;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 150);
    }

};