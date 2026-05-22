class Character extends MoveableObject {


    height = 250;
    y = 80;
    speed = 5;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];
    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    world;
    currentImage = 0;
    idleTimer = 0;
    coins = 0;
    bottles = 0;

    deadAnimationStarted = false;
    deadImageIndex = 0;
    deadJumpDone = false;
    gameOver = false


    offset = {
        top: 100,
        left: 15,
        right: 20,
        bottom: 10
    };


    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.applyGravity();
        this.animate();
        this.animationSpeed = 50;
        this.animationTimer = 0;
    }

    collectCoin() {
        this.coins += 20;
    }

    collectBottle() {
        if (this.bottles < 5) {
            this.bottles += 1;
        }
    }

    /**
     * Checks if the character lands on top of an enemy.
     */
    isJumpingOn(enemy) {
        const c = this.offset, e = enemy.offset;
        const charLeft = this.x + c.left;
        const charRight = this.x + this.width - c.right;
        const enemyLeft = enemy.x + e.left;
        const enemyRight = enemy.x + enemy.width - e.right;
        const overlapX = charRight > enemyLeft && charLeft < enemyRight;
        const charBottom = this.y + this.height - c.bottom;
        const enemyTop = enemy.y + e.top;
        const tolerance = 50;
        const nearTop = charBottom <= enemyTop + tolerance;
        const falling = this.speedY < 0;

        return overlapX && falling && nearTop;
    }

    /**
     * Playys the character death animation.
     */
    playDeadAnimation() {
        if (this.animationTimer >= 200) {
            if (this.deadImageIndex < this.IMAGES_DEAD.length) {
                this.playDeadJump();
                this.playAnimationOnce(this.IMAGES_DEAD, this.deadImageIndex);
                this.deadImageIndex++;
            } else {
                this.playAnimationOnce(this.IMAGES_DEAD, this.IMAGES_DEAD.length - 1);
            }
            this.animationTimer = 0;
        }
        this.isGameOver();
    }

    isGameOver() {
        if (this.y > 600) {
            this.world.gameOver();
        }
    }

    playDeadJump() {
        if (this.deadImageIndex === 2 && !this.deadJumpDone) {
            this.deadJump();
            this.deadJumpDone = true;
        }
    }

    animate() {
        this.moveInterval = setInterval(() => this.moveCharacter(), 1000 / 60);
        this.animationInterval = setInterval(() => this.playCharacter(), 50);
    }

    /**
     * Moves the character based on keyboard input.
     */
    moveCharacter() {
        if (this.world && this.world.isPaused) return;
        if (this.canMoveRight()) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.canMoveLeft()) {
            this.moveLeft();
            this.otherDirection = true;
        }
        if (this.canJump()) {
            this.jump();
        }
        let cameraOffset = this.otherDirection ? 500 : 100;
        let targetCameraX = -this.x + cameraOffset;

        this.world.camera_x += (targetCameraX - this.world.camera_x) * 0.08;
    }

    canMoveRight() {
        return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
    }

    canMoveLeft() {
        return this.world.keyboard.LEFT && this.x > 0;
    }

    canJump() {
        return this.world.keyboard.SPACE && !this.isAboveGround();
    }

    /**
     * Chooses the correct character aanimation.
     */
    playCharacter() {
        if (this.world && this.world.isPaused) return;

        this.animationTimer += 50;

        if (this.isDead()) {
            this.handleDeadAnimation();
        } else if (this.isHurt()) {
            this.playHurt();
        } else if (this.isAboveGround()) {
            this.playJumping();
        } else if (this.isWalking()) {
            this.playWalking();
        } else if (!this.isAboveGround()) {
            this.playIdleAnimation();
        }
    }

    /**
     * Prepares and plays the death animation.
     */
    handleDeadAnimation() {
        if (!this.deadAnimationStarted) {
            this.deadAnimationStarted = true;
            this.deadImageIndex = 0;
            this.animationTimer = 0;
            this.deadJumpDone = false;
        }
        this.playDeadAnimation();
    }

    playHurt() {
        this.animationSpeed = 50;
        this.playAnimation(this.IMAGES_HURT);
    }

    isWalking() {
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    playWalking() {
        this.animationSpeed = 50;
        this.playAnimation(this.IMAGES_WALKING);
    }

    playJumping() {
        this.animationSpeed = 50;
        this.playAnimation(this.IMAGES_JUMPING);
    }

    /**
     * Plays the idle or long idle animation.
     */
    playIdleAnimation() {
        this.idleTimer += 50;
        if (this.idleTimer >= 5000) {
            this.animationSpeed = 100;
            if (this.timeOverSpeed()) {
                this.playLongIdle();
            }
        } else {
            this.animationSpeed = 100;
            if (this.timeOverSpeed()) {
                this.playIdle();
            }
        }
    }

    timeOverSpeed() {
        return this.animationTimer >= this.animationSpeed;
    }

    playLongIdle() {
        this.playAnimation(this.IMAGES_LONG_IDLE);
        this.animationTimer = 0;
    }

    playIdle() {
        this.playAnimation(this.IMAGES_IDLE);
        this.animationTimer = 0;
    }

    stopAnimations() {
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }

}