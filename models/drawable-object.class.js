class DrawableObject {
    img;
    imageCache = {}
    currentImage = 0;
    x = 100;
    y = 250;
    height = 175;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    /**
     * draws the current image on the canvas
     * @param {CanvasRenderingContext2D} ctx - the convas context used to draw 
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {

        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = '';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = 'red';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
            ctx.stroke();
        }
    }

    /**
     * load miltiple images and saves them in the imageCache
     * @param {string[]} arr - an array of image paths to load 
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}