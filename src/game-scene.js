export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.move_speed = 5;
    }

    preload() {
        this.load.image('geekythor', 'assets/geekythor.jpg');
    }

    create() {
        this.geeky_thor = this.add.image(400, 300, 'geekythor');
        this.up_key = this.input.keyboard.addKey('up');
        this.down_key = this.input.keyboard.addKey('down');
        this.left_key = this.input.keyboard.addKey('left');
        this.right_key = this.input.keyboard.addKey('right');
    }

    update() {
        this.geeky_thor.y -= this.input.keyboard.checkDown(this.up_key) ? this.move_speed : 0;
        this.geeky_thor.y += this.input.keyboard.checkDown(this.down_key) ? this.move_speed : 0;
        this.geeky_thor.x -= this.input.keyboard.checkDown(this.left_key) ? this.move_speed : 0;
        this.geeky_thor.x += this.input.keyboard.checkDown(this.right_key) ? this.move_speed : 0;
    }
}