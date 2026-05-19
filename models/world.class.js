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

    areStartAssetsLoaded() {
        let objectsToCheck = this.obcjectsToCheck();
        let firstBackground = this.level.backgroundObjects[0];
        if (firstBackground) {
            objectsToCheck.push(firstBackground);
        }

        return objectsToCheck.every(obj => obj.imagesLoaded > 0 || (obj.img && obj.img.complete));
    }

    obcjectsToCheck() {
        let objectsToCheck = [
            this.character,
            this.statusBar,
            this.statusBarCoin,
            this.statusBarBottle
        ];
        return objectsToCheck;
    }

    run() {
        let interval = setInterval(() => {
            if (this.isGameOver || this.isPaused) return;
            this.checkGameCollisions();
            this.checkThrowObjects();
            this.checkEndbossFightStart();
        }, 1000 / 60);
        this.intervals.push(interval);
    }

    checkGameCollisions() {
        this.checkEnemyCollisions();
        this.checkBottleEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
    }

    checkEndbossFightStart() {
        if (this.character.x >= this.level.level_end_x - 400) {
            this.endBossFightStarted = true;
        }
    }

    checkThrowObjects() {
        if (this.canThrowBottle()) {
            this.throwBottle();
        }
        this.unlockThrowIfKeyReleased();
    }

    canThrowBottle() {
        return this.keyboard.D && this.character.bottles > 0 && !this.throwLocked;
    }

    throwBottle() {
        this.throwLocked = true;
        let bottle = new ThrowableObject(
            this.character.x + 100,
            this.character.y + 100);
        this.throwAbleObjects.push(bottle);
        this.character.bottles -= 1;
        this.statusBarBottle.setPercentage(this.character.bottles);
    }

    unlockThrowIfKeyReleased() {
        if (!this.keyboard.D) this.throwLocked = false;
    }

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

    canCheckEnemyCollision(enemy) {
        return !enemy.dead && !this.character.isDead();
    }

    killEnemy(enemy) {
        enemy.dieEnemy();
    }

    handleEnemyCollisionResult(jumpedOnEnemy, touchedEnemyFromSide) {
        if (jumpedOnEnemy) {
            this.character.speedY = 15;
        } else if (touchedEnemyFromSide && !this.character.isHurt()) {
            this.hurtCharacter();
        }
    }

    hurtCharacter() {
        this.character.hit();
        this.audioManager.play('hurt');
        this.statusBar.setPercentage(this.character.energy);
    }

    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.remove);
    }

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

    hurtEndboss(endboss) {
        endboss.hitEndBoss();
        this.statusBarEndboss.setPercentage(endboss.energy);
    }

    removeBottle() {
        this.throwAbleObjects = this.throwAbleObjects.filter(bottle => !bottle.isRemoved);
    }


    checkCoinCollisions() {
        this.level.coins = this.level.coins.filter(coin => !this.collectCoinIfColliding(coin));
    }

    collectCoinIfColliding(coin) {
        if (!this.character.isColliding(coin)) return false;
        this.audioManager.play('coins');
        this.character.collectCoin();
        this.statusBarCoin.setPercentage(this.character.coins);
        return true;
    }

    checkBottleCollisions() {
        this.level.bottles = this.level.bottles.filter(bottle => !this.collectBottleIfColliding(bottle));
    }

    collectBottleIfColliding(bottle) {
        if (!this.character.isColliding(bottle)) return false;
        if (this.character.bottles >= 5) return false;
        this.audioManager.play('throw-collect');
        this.character.collectBottle();
        this.statusBarBottle.setPercentage(this.character.bottles);
        return true;
    }


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

    addObjectsToMapAndCharacter() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwAbleObjects);
        this.addToMap(this.character);
    }

    statusBarToMap() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
    }

    endBossFightStatusBarToMap() {
        if (this.endBossFightStarted) {
            this.addToMap(this.statusBarEndboss);
        }
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    };


    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
    }

    removeEnemy(enemyToRemove) {
        this.level.enemies = this.level.enemies.filter(enemy => enemy !== enemyToRemove);
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.audioManager.stop('background');
        this.audioManager.play('gameover');
        this.stopGame();
        document.getElementById('gameOverScreen').classList.remove('d_none');
    }

    gameWin() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.audioManager.stop('background');
        this.audioManager.play('winner');
        this.stopGame();
        document.getElementById('gameWinScreen').classList.remove('d_none');
    }

    stopGame() {
        this.audioManager.stop('background');
        this.intervals.forEach(interval => clearInterval(interval));
        cancelAnimationFrame(this.animationFrameId);
        this.character.stopAnimations();
        this.level.enemies.forEach(enemy => enemy.stopAnimations());
        this.level.coins.forEach(coin => coin.stopAnimations());
        this.throwAbleObjects.forEach(bottle => bottle.stopAnimations());
    }

    pauseGame() {
        this.isPaused = true;
        this.audioManager.pause('background');
    }

    resumeGame() {
        this.isPaused = false;
        this.audioManager.playMusic('background');
    }
}