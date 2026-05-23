class Chicken extends MoveableObject {

    y = 355;
    height = 70;
    width = 70;
    dead = false;

    offset = {
        top: 5,
        left: 0,
        right: 0,
        bottom: 5,
    };


    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    ];
    currentImage = 0;


    /**
     * Creates a normal chicken enemy.
     */
    constructor() {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 700 + Math.random() * 1500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    /**
     * Starts the chicken movement and animation loops.
     */
    animate() {
        this.moveInterval = setInterval(() => this.moveChicken(), 1000 / 60);
        this.animationInterval = setInterval(() => this.playChickenAnimation(), 150);
    }

    /**
     * Moves the chicken to the left.
     */
    moveChicken() {
        if (this.world && this.world.isPaused) return;
        if (!this.dead) {
            this.moveLeft();
        }
    }

    /**
     * Plays the chicken walking or dead image.
     */
    playChickenAnimation() {
        if (this.world && this.world.isPaused) return;
        if (this.dead) {
            this.loadImage(this.IMAGES_DEAD[0]);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Stops the chicken animation loops.
     */
    stopAnimations() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}
