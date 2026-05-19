class AnimatedObject extends CollidableObject {

    /**
     * Plays an animation by switching between image frames.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Shows one specific image frame. 
     */
    playAnimationOnce(images, index) {
        if (index < images.length) {
            let path = images[index];
            if (this.imageCache[path]) {
                this.img = this.imageCache[path];
            }
        }
    }

}
