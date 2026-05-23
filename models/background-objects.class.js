class BackgroundObjects extends MoveableObject {

    width = 720;
    height = 480;

    /**
     * Creates a background image.
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
