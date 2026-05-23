class ThrowableObject extends MoveableObject {

    offset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
    };

    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    ]



    /**
     * Creates a thrown bottle.
     */
    constructor(x, y, otherDirection) {
        super();
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.width = 70;
        this.height = 70;
        this.throw();
        this.splashed = false;
    }

    /**
     * Throws the bottle through the air.
     */
    throw() {
        this.speedY = 20;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (this.splashed) return;
            if (this.otherDirection) {
                this.x -= 10;
            } else {
                this.x += 10;
            }
            this.playAnimation(this.IMAGES_BOTTLE);
        }, 25);
        audioManager.play('throw');
    }

    /**
     * Starts the bottle splash.
     */
    splash() {
        if (this.splashed) return;
        this.splashed = true;
        clearInterval(this.throwInterval);
        this.stopGravity();
        this.speedY = 0;
        this.playSplashAnimation();
        audioManager.play('splash');
    }

    /**
     * Plays the splash animation.
     */
    playSplashAnimation() {
        let i = 0;
        this.splashInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_SPLASH);
            i++;
            if (i >= this.IMAGES_SPLASH.length) {
                clearInterval(this.splashInterval);
                this.isRemoved = true;
            }
        }, 100);
    }

    /**
     * Stops the bottle animation loops.
     */
    stopAnimations() {
        clearInterval(this.throwInterval);
        clearInterval(this.splashInterval);
    }
}
