class CollidableObject extends DrawableObject {


    constructor() {
        super();
        this.offset = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        };
    }

    isColliding(other) {
        return this.x + this.width - this.offset.right > other.x + other.offset.left &&
            this.x + this.offset.left < other.x + other.width - other.offset.right &&
            this.y + this.height - this.offset.bottom > other.y + other.offset.top &&
            this.y + this.offset.top < other.y + other.height - other.offset.bottom;
    }
}