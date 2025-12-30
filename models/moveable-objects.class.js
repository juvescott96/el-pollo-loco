class MoveableObjects {
    x = 100;
    y = 250;
    img;
    height = 175;
    width = 100;
    imageCache = {};



    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {
        console.log('Moving Right');
    }


}