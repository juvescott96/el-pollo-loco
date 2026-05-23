class World {

    character = new Character();
    level;
    canvas;
    ctx;
    keyboard;
    audioManager;
    camera_x = -100;
    statusBar;
    statusBarCoin;
    statusBarBottle;
    statusBarEndboss;
    throwAbleObjects = [];
    endBossFightStarted = false;
    isGameOver = false;
    isPaused = false;
    animationFrameId;
    intervals = [];


    /**
     * Creates the world and starts the game logic.
     */
    constructor(canvas, keyboard, audioManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.audioManager = audioManager;
        this.statusBar = new StatusBar();
        this.statusBarCoin = new StatusBarCoin();
        this.statusBarBottle = new StatusBarBottle();
        this.statusBarEndboss = new StatusBarEndboss();
        this.level = new createLevel1();
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Connects the world instance to all game objects.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
        this.level.coins.forEach((coin) => {
            coin.world = this;
        })
        this.level.clouds.forEach((cloud) => {
            cloud.world = this;
        })
        this.level.bottles.forEach((bottle) => {
            bottle.world = this;
        });
    }

    /**
     * Checks if the important start assets are loaded.
     */
    areStartAssetsLoaded() {
        let objectsToCheck = this.obcjectsToCheck();
        let firstBackground = this.level.backgroundObjects[0];
        if (firstBackground) {
            objectsToCheck.push(firstBackground);
        }

        return objectsToCheck.every(obj => obj.imagesLoaded > 0 || (obj.img && obj.img.complete));
    }

    /**
     * Returns the objects that must be loaded before the game starts.
     */
    obcjectsToCheck() {
        let objectsToCheck = [
            this.character,
            this.statusBar,
            this.statusBarCoin,
            this.statusBarBottle
        ];
        return objectsToCheck;
    }

    /**
     * Starts the main game loop for collisions and actions.
     */
    run() {
        let interval = setInterval(() => {
            if (this.isGameOver || this.isPaused) return;
            this.checkGameCollisions();
            this.checkThrowObjects();
            this.checkEndbossFightStart();
        }, 1000 / 60);
        this.intervals.push(interval);
    }

    /**
     * Checks all important collisions in the game.
     */
    checkGameCollisions() {
        this.checkEnemyCollisions();
        this.checkBottleEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
    }

    /**
     * Starts the endboss fight when the character reaches the boss area.
     */
    checkEndbossFightStart() {
        if (this.character.x >= this.level.level_end_x - 1200) {
            this.endBossFightStarted = true;
        }
    }

    /**
     * Checks if the player can throw a bottle.
     */
    checkThrowObjects() {
        if (this.canThrowBottle()) {
            this.throwBottle();
        }
        this.unlockThrowIfKeyReleased();
    }

    /**
     * Checks if the player is allowed to throw a bottle.
     */
    canThrowBottle() {
        return this.keyboard.D && this.character.bottles > 0 && !this.throwLocked;
    }

    /**
     * Creates and throws a new bottle from the character position.
     */
    throwBottle() {
        this.throwLocked = true;

        let bottleX = this.character.otherDirection
            ? this.character.x - 20
            : this.character.x + 40;

        let bottle = new ThrowableObject(
            bottleX,
            this.character.y + 100,
            this.character.otherDirection
        );
        this.throwAbleObjects.push(bottle);
        this.character.bottles -= 1;
        this.statusBarBottle.setPercentage(this.character.bottles);
    }

    /**
     * Unlocks throwing when the throw key is released.
     */
    unlockThrowIfKeyReleased() {
        if (!this.keyboard.D) this.throwLocked = false;
    }

    /**
     * Checks collisions between the character and enemies.
     */
    checkEnemyCollisions() {
        let jumpedOnEnemy = false;
        let touchedEnemyFromSide = false;

        this.level.enemies.forEach(enemy => {
            if (!this.canCheckEnemyCollision(enemy)) return;
            if (!this.character.isColliding(enemy)) return;

            if (this.character.isJumpingOn(enemy)) {
                this.killEnemy(enemy);
                jumpedOnEnemy = true;
            } else {
                touchedEnemyFromSide = true;
            }
        });
        this.handleEnemyCollisionResult(jumpedOnEnemy, touchedEnemyFromSide);
        this.removeDeadEnemies();
    }

    /**
     * Checks if this enemy can collide with the character.
     */
    canCheckEnemyCollision(enemy) {
        return !enemy.dead && !this.character.isDead();
    }

    /**
     * Kills the enemy after the character jumps on it.
     */
    killEnemy(enemy) {
        enemy.dieEnemy();
    }

    /**
     * Handles what happens after touching or jumping on an enemy.
     */
    handleEnemyCollisionResult(jumpedOnEnemy, touchedEnemyFromSide) {
        if (jumpedOnEnemy) {
            this.character.speedY = 15;
        } else if (touchedEnemyFromSide && !this.character.isHurt()) {
            this.hurtCharacter();
        }
    }

    /**
     * Damages the character and updates the health bar.
     */
    hurtCharacter() {
        this.character.hit();
        this.audioManager.play('hurt');
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * Removes enemies that are marked as removed.
     */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.remove);
    }

    /**
     * Checks if thrown bottles hit enemies.
     */
    checkBottleEnemyCollisions() {
        this.throwAbleObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (enemy.dead) return;
                if (bottle.splashed) return;
                if (!bottle.isColliding(enemy)) return;
                if (enemy instanceof Endboss) {
                    this.hurtEndboss(enemy);
                } else {
                    enemy.dieEnemy();
                } bottle.splash();
            });
        });
        this.removeBottle();
    }

    /**
     * Damages the endboss and updates the endboss health bar.
     */
    hurtEndboss(endboss) {
        endboss.hitEndBoss();
        this.statusBarEndboss.setPercentage(endboss.energy);
    }

    /**
     * Removes bottles that finished their splash animation.
     */
    removeBottle() {
        this.throwAbleObjects = this.throwAbleObjects.filter(bottle => !bottle.isRemoved);
    }


    /**
     * Checks if the character collects coins.
     */
    checkCoinCollisions() {
        this.level.coins = this.level.coins.filter(coin => !this.collectCoinIfColliding(coin));
    }

    /**
    * Collects a coin when the character touches it.
    */
    collectCoinIfColliding(coin) {
        if (!this.character.isColliding(coin)) return false;
        this.audioManager.play('coins');
        this.character.collectCoin();
        this.statusBarCoin.setPercentage(this.character.coins);
        return true;
    }

    /**
     * Checks if the character collects bottles.
     */
    checkBottleCollisions() {
        this.level.bottles = this.level.bottles.filter(bottle => !this.collectBottleIfColliding(bottle));
    }

    /**
     * Collects a bottle when the character touches it, if the character has less than 5 bottles.
     */
    collectBottleIfColliding(bottle) {
        if (!this.character.isColliding(bottle)) return false;
        if (this.character.bottles >= 5) return false;
        this.audioManager.play('throw-collect');
        this.character.collectBottle();
        this.statusBarBottle.setPercentage(this.character.bottles);
        return true;
    }


    /**
     * Draws the complete game world on the canvas.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMapAndCharacter();
        this.ctx.restore();
        this.statusBarToMap();
        this.endBossFightStatusBarToMap();
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Adds all moving and static game objects to the canvas, including the character.
     */
    addObjectsToMapAndCharacter() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwAbleObjects);
        this.addToMap(this.character);
    }

    /**
     * Draws the health, coin and bottle bars.
     */
    statusBarToMap() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
    }

    /**
     * Draws the endboss bar during the boss fight.
     */
    endBossFightStatusBarToMap() {
        if (this.endBossFightStarted) {
            this.addToMap(this.statusBarEndboss);
        }
    }

    /**
     * Adds a list of objects to the canvas.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Draws one object on the canvas.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    };


    /**
     * Flips an object before drawing it in the opposite direction.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas after drawing a flipped object.
     */
    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
    }

    /**
     * Removes one enemy from the level.
     */
    removeEnemy(enemyToRemove) {
        this.level.enemies = this.level.enemies.filter(enemy => enemy !== enemyToRemove);
    }

    /**
     * Ends the game after the character loses.
     */
    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.audioManager.stop('background');
        this.audioManager.play('gameover');
        this.stopGame();
        document.getElementById('gameOverScreen').classList.remove('d_none');
    }

    /**
     * Ends the game after the player wins the endboss fight.
     */
    gameWin() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.audioManager.stop('background');
        this.audioManager.play('winner');
        this.stopGame();
        document.getElementById('gameWinScreen').classList.remove('d_none');
    }

    /**
     * Stops all game intervals, animations and sounds.
     */
    stopGame() {
        this.audioManager.stop('background');
        this.intervals.forEach(interval => clearInterval(interval));
        cancelAnimationFrame(this.animationFrameId);
        this.character.stopAnimations();
        this.level.enemies.forEach(enemy => enemy.stopAnimations());
        this.level.coins.forEach(coin => coin.stopAnimations());
        this.throwAbleObjects.forEach(bottle => bottle.stopAnimations());
    }

    /**
     * Pauses the game.
     */
    pauseGame() {
        this.isPaused = true;
        this.audioManager.pause('background');
    }

    /**
     * Continues the game after pause.
     */
    resumeGame() {
        this.isPaused = false;
        this.audioManager.playMusic('background');
    }
}
