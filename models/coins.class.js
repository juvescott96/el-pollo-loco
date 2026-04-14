class Coins extends AnimatedObject {

    height = 150;
    width = 150;

    offset = {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50
    };

    IMAGES_ANIMATED = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png',
    ];
    currentImage = 0;

    constructor() {
        super();
        this.loadImage('img/8_coin/coin_1.png');
        this.x = 400 + Math.random() * 1800;
        this.y = 50 + Math.random() * 220;
        this.loadImages(this.IMAGES_ANIMATED);
        this.animate();
    }

    animate() {
        this.animationInterval = setInterval(() => {
            if (this.world && this.world.isPaused) return;
            this.playAnimation(this.IMAGES_ANIMATED);
        }, 200);
    }

    stopAnimations() {
        clearInterval(this.animationInterval);
    }

};