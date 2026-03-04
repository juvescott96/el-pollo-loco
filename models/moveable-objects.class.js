class MoveableObject extends AnimatedObject {

    imageCache = {};
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;


    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }

        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 180;
        }
    }


    hit() {
        this.energy -= 1;
        console.log(this.energy);

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

    }

}