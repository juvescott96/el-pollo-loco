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

    /**
     * Creates a coin.
     */
    constructor() {
        super();
        this.loadImage('img/8_coin/coin_1.png');
        this.x = 400 + Math.random() * 1800;
        this.y = 50 + Math.random() * 220;
        this.loadImages(this.IMAGES_ANIMATED);
        this.animate();
    }

    /**
     * Starts the coin animation loop.
     */
    animate() {
        this.animationInterval = setInterval(() => {
            if (this.world && this.world.isPaused) return;
            this.playAnimation(this.IMAGES_ANIMATED);
        }, 200);
    }

    /**
     * Stops the coin animation loop.
     */
    stopAnimations() {
        clearInterval(this.animationInterval);
    }
};