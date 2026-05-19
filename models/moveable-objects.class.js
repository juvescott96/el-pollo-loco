class MoveableObject extends AnimatedObject {

    imageCache = {};
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;


    /**
     * Applies gravity to objects that can move vertically.
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }

        }, 1000 / 25);
    }

    stopGravity() {
        clearInterval(this.gravityInterval);
    }

    /**
     * Checks if the object is above the ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        if (this.isFallingAfterDeath()) {
            return true;
        }
        return this.y < 180;
    }

    isFallingAfterDeath() {
        if (this instanceof Character && this.isDead() && this.deadJumpDone) {
            return true;
        }
    }

    /**
     * Reduces the object´s energy after a hit.
     */
    hit() {
        this.energy -= 10;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
        this.idleTimer = 0;
    }

    isDead() {
        return this.energy == 0;
    }

    /**
     * Checks if the object was hit recently.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // difference in ms
        timepassed = timepassed / 1000; // difference in s
        return timepassed < 1;
    }

    moveRight() {
        this.x += this.speed;
        this.idleTimer = 0;
    }

    moveLeft() {
        this.x -= this.speed;
        this.idleTimer = 0;
    }

    jump() {
        this.speedY = 30;
        this.idleTimer = 0;
        audioManager.play('jump');
    }

    deadJump() {
        this.speedY = 20;
    }

    dieEnemy() {
        this.dead = true;

        setTimeout(() => {
            this.remove = true;
        }, 1000);
    }

    /**
     * Damages the endboss.
     */
    hitEndBoss() {
        if (this.dead) return;
        this.energy -= 20;
        this.lastHit = new Date().getTime();

        if (this.energy <= 0) {
            this.energy = 0;
            this.dieEnemy();
        }
    }
}