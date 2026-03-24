class DrawableObject {
    img;
    imageCache = {}
    currentImage = 0;
    x = 100;
    y = 250;
    height = 175;
    width = 100;
    imagesToLoad = 0;
    imagesLoaded = 0;


    /**
     * draws the current image on the canvas
     * @param {CanvasRenderingContext2D} ctx - the convas context used to draw 
     */
    draw(ctx) {
        if (!this.img || !this.img.complete) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    loadImage(path) {
        this.imagesToLoad++;
        this.img = new Image();
        this.img.onload = () => {
            this.imagesLoaded++;
        };
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            this.imagesToLoad++;
            let img = new Image();
            img.onload = () => {
                this.imagesLoaded++;
            };
            img.src = path;
            this.imageCache[path] = img;
        });
    }

}