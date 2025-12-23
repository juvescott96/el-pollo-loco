class MoveableObjects {
    x = 100;
    y = 260;
    img;
    height = 175;
    width = 100;



    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log('Moving Right');
    }


}