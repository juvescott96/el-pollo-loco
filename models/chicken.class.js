class Chicken extends MoveableObject {

    y = 355;
    height = 70;
    width = 70;
    dead = false;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    currentImage = 0;


    constructor() {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 700 + Math.random() * 1500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    dieEnemy() {
        this.dead = true;
        this.loadImage('img/3_enemies_chicken/chicken_normal/2_dead/dead.png');

        setTimeout(() => {
            this.y = 1000;
        }, 1000);
    }

    animate() {

        setInterval(() => {
            if (!this.dead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.dead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }
}