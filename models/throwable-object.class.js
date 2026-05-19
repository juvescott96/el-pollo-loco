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



    constructor(x, y) {
        super();
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 70;
        this.throw();
        this.splashed = false;
    }

    throw() {
        this.speedY = 20;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (this.splashed) return;
            this.x += 10;
            this.playAnimation(this.IMAGES_BOTTLE);
        }, 25);
        audioManager.play('throw');
    }

    splash() {
        if (this.splashed) return;
        this.splashed = true;
        clearInterval(this.throwInterval);
        this.stopGravity();
        this.speedY = 0;
        this.playSplashAnimation();
        audioManager.play('splash');
    }

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

    stopAnimations() {
        clearInterval(this.throwInterval);
        clearInterval(this.splashInterval);
    }
}