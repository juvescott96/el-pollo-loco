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
     * Draws the current image on the canvas.
     */
    draw(ctx) {
        if (!this.img || !this.img.complete) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Loads one image for this object.
     */
    loadImage(path) {
        this.imagesToLoad++;
        this.img = new Image();
        this.img.onload = () => {
            this.imagesLoaded++;
        };
        this.img.src = path;
    }

    /**
     * Loads multiple images for animations.
     */
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