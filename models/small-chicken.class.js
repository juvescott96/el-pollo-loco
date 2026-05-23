class SmallChicken extends MoveableObject {

    y = 355;
    height = 70;
    width = 70;
    dead = false;

    offset = {
        top: 5,
        left: 7,
        right: 7,
        bottom: 5,
    };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];
    currentImage = 0;


    /**
     * Creates a small chicken enemy.
     */
    constructor() {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = 700 + Math.random() * 1500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    /**
     * Starts the small chicken movement and animation loops.
     */
    animate() {

        this.moveInterval = setInterval(() => {
            if (this.world && this.world.isPaused) return;
            if (!this.dead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (this.world && this.world.isPaused) return;
            if (this.dead) {
                this.loadImage(this.IMAGES_DEAD[0]);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }

    /**
     * Stops the small chicken animation loops.
     */
    stopAnimations() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}
