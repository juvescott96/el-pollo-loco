class Endboss extends MoveableObject {

    height = 350;
    width = 250;
    y = 105;
    energy = 100;
    dead = false;
    speed = 3;
    fightStartTime = 0;
    deadImageIndex = 0;
    deadAnimationLoops = 0;
    deadAnimationFinished = false;

    offset = {
        top: 55,
        left: 20,
        right: 0,
        bottom: 10
    };


    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    currentImage = 0;

    /**
     * Creates the endboss and loads all boss images.
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.animate();
    }

    /**
     * Starts the endboss animation loop.
     */
    animate() {
        this.animationInterval = setInterval(() => {
            if (this.world && this.world.isPaused) return;
            if (!this.world) return;
            if (!this.world.endBossFightStarted) return;
            this.endBossStartFight();
            if (this.isEndbossAlertTime()) {
                this.playAnimation(this.IMAGES_ALERT);
                return;
            }
            let characterCenter = this.world.character.x + this.world.character.width / 2;
            let endbossCenter = this.x + this.width / 2;
            let distance = Math.abs(endbossCenter - characterCenter);
            this.moveEndboss(distance, characterCenter, endbossCenter);
        }, 120);
    }

    /**
     * Controls the endboss movement and current animation.
     */
    moveEndboss(distance, characterCenter, endbossCenter) {
        if (this.isDead()) {
            this.playDeadAnimation();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isCloseEnoughToAttack()) {
            this.turnToCharacter(characterCenter, endbossCenter);
            this.playAnimation(this.IMAGES_ATTACK);
        } else {
            this.speed = distance < 400 ? 12 : 3;
            this.followCharacter(characterCenter, endbossCenter);
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Checks if the endboss is close enough to attack.
     */
    isCloseEnoughToAttack() {
        let character = this.world.character;
        let characterLeft = character.x + character.offset.left;
        let characterRight = character.x + character.width - character.offset.right;
        let endbossLeft = this.x + this.offset.left;
        let endbossRight = this.x + this.width - this.offset.right;
        let horizontalGap;

        if (characterRight < endbossLeft) {
            horizontalGap = endbossLeft - characterRight;
        } else if (characterLeft > endbossRight) {
            horizontalGap = characterLeft - endbossRight;
        } else {
            horizontalGap = 0;
        }
        return horizontalGap < 2;
    }

    /**
     * Turns the endboss toward the character.
     */
    turnToCharacter(characterCenter, endbossCenter) {
        if (characterCenter < endbossCenter) {
            this.otherDirection = false;
        } else {
            this.otherDirection = true;
        }
    }

    /**
     * Moves the endboss toward the character.
     */
    followCharacter(characterCenter, endbossCenter) {
        if (characterCenter < endbossCenter) {
            this.moveLeft();
            this.otherDirection = false;
        } else {
            this.moveRight();
            this.otherDirection = true;
        }
    }

    /**
     * Saves the time when the boss fight starts.
     */
    endBossStartFight() {
        if (this.world.endBossFightStarted && this.fightStartTime === 0) {
            this.fightStartTime = new Date().getTime();
        }
    }

    /**
     * Checks if the endboss is in the alert phase.
     */
    isEndbossAlertTime() {
        let timePassed = (new Date().getTime() - this.fightStartTime) / 1000;
        return timePassed < 1.5;
    }

    /**
     * Plays the dead animation.
     */
    playDeadAnimation() {
        if (this.deadAnimationFinished) return;
        this.playAnimationOnce(this.IMAGES_DEAD, this.deadImageIndex);
        this.deadImageIndex++;
        this.countDeadAnimationLoops();
        this.dieEndboss();
    }

    /**
     * Counts how often the death animation has played.
     */
    countDeadAnimationLoops() {
        if (this.deadImageIndex >= this.IMAGES_DEAD.length) {
            this.deadImageIndex = 0;
            this.deadAnimationLoops++;
        }
    }

    /**
     * Removes the endboss and triggers the win screen.
     */
    dieEndboss() {
        if (this.deadAnimationLoops >= 2) {
            this.deadAnimationFinished = true;
            this.remove = true;
            this.stopAnimations();
            this.world.removeEnemy(this);
            requestAnimationFrame(() => {
                this.world.gameWin();
            });
        }
    }

    /**
     * Marks the endboss as dead.
     */
    dieEnemy() {
        this.dead = true;
    }

    /**
     * Stops the endboss animation loop.
     */
    stopAnimations() {
        clearInterval(this.animationInterval);
    }
}
