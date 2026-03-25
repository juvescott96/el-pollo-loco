class AnimatedObject extends CollidableObject {

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    playAnimationOnce(images, index) {
        if (index < images.length) {
            let path = images[index];
            if (this.imageCache[path]) {
                this.img = this.imageCache[path];
            }
        }
    }

}
