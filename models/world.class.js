class World {

    character = new Character();
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = -100;
    statusBar;
    statusBarCoin;
    statusBarBottle;
    statusBarEndboss;
    throwAbleObjects = [];
    endBossFightStarted = false;
    gameOver = false;
    animationFrameId;
    intervals = [];

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
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
    }

    areStartAssetsLoaded() {
        let objectsToCheck = [
            this.character,
            this.statusBar,
            this.statusBarCoin,
            this.statusBarBottle
        ];

        let firstBackground = this.level.backgroundObjects[0];
        if (firstBackground) {
            objectsToCheck.push(firstBackground);
        }

        return objectsToCheck.every(obj => obj.imagesLoaded > 0 || (obj.img && obj.img.complete));
    }


    run() {
        let interval = setInterval(() => {
            this.checkCollisionsEnemies();
            this.checkThrowObjects();
            this.checkCollisionsCoins();
            this.checkCollisionsBottles();
            this.checkCollisionsEnemiesWithBottle()
            if (this.character.x >= this.level.level_end_x - 400) {
                this.endBossFightStarted = true;
            }
        }, 1000 / 60);

        this.intervals.push(interval);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottles > 0 && !this.throwLocked) {
            this.throwLocked = true;

            let bottle = new ThrowableObject(
                this.character.x + 100,
                this.character.y + 100);

            this.throwAbleObjects.push(bottle);

            this.character.bottles -= 1;
            this.statusBarBottle.setPercentage(this.character.bottles);
        }

        if (!this.keyboard.D) this.throwLocked = false;
    }

    checkCollisionsEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (enemy.dead || this.character.isDead()) return;
            if (!this.character.isColliding(enemy)) return;

            if (this.character.isJumpingOn(enemy)) {
                enemy.dieEnemy();
                this.character.speedY = 15;
            } else {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.remove);
    }

    checkCollisionsEnemiesWithBottle() {
        this.throwAbleObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (enemy.dead) return;
                if (bottle.splashed) return;
                if (!bottle.isColliding(enemy)) return;

                if (enemy instanceof Endboss) {
                    enemy.hitEndBoss();
                    this.statusBarEndboss.setPercentage(enemy.energy);
                } else {
                    enemy.dieEnemy();
                }

                bottle.splash();
            });
        });
        this.throwAbleObjects = this.throwAbleObjects.filter(bottle => !bottle.isRemoved);
    }

    checkCollisionsCoins() {
        this.level.coins = this.level.coins.filter((coin) => {
            if (this.character.isColliding(coin)) {
                this.character.collectCoin();
                this.statusBarCoin.setPercentage(this.character.coins);
                return false;
            } else {
                return true;
            }
        });
    }

    checkCollisionsBottles() {
        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (this.character.isColliding(bottle) && this.character.bottles < 5) {
                this.character.collectBottle();
                this.statusBarBottle.setPercentage(this.character.bottles);
                return false;
            } else {
                return true;
            }
        });
    }

    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwAbleObjects);
        this.addToMap(this.character);
        this.ctx.restore();

        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        if (this.endBossFightStarted) {
            this.addToMap(this.statusBarEndboss);
        }
        this.animationFrameId = requestAnimationFrame(() => this.draw());
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

        // mo.drawFrame(this.ctx);

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

    endGame() {
        this.gameOver = true;

        this.intervals.forEach(interval => clearInterval(interval));
        cancelAnimationFrame(this.animationFrameId);

        this.character.stopAnimation();
        this.level.enemies.forEach(enemy => enemy.stopAnimations());
        this.level.coins.forEach(coin => coin.stopAnimations());
        this.level.Endboss.forEach(endboss => endboss.stopAnimations());
        this.throwAbleObjects.forEach(bottle => bottle.stopAnimations());
    }
}