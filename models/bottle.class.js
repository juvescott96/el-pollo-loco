class Bottles extends DrawableObject {
    height = 80;
    width = 80;

    offset = {
        top: 15,
        left: 35,
        right: 15,
        bottom: 10
    };

    /**
     * Creates a bottle on the ground.
     */
    constructor() {
        super();
        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = 200 + Math.random() * 2500;
        this.y = 350;
    }
}
