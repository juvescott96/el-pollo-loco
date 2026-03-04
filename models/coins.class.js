class Coins extends AnimatedObject {

    height = 150;
    width = 150;

    offset = {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50
    };

    IMAGES_WALKING = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png',
    ];
    currentImage = 0;

    constructor() {
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