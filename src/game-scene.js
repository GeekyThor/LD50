export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.move_speed = 3;
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('bomb', 'assets/bomb.png');
    }

    create() {
        this.add.image(400, 300, 'bg');
        this.add.image(400, 550, 'ground');
        this.player = this.add.image(400, 495, 'player');
        this.add.image(400, 300, 'bomb');
        this.left_key = this.input.keyboard.addKey('left');
        this.right_key = this.input.keyboard.addKey('right');
    }

    update() {
        this.player.x -= this.input.keyboard.checkDown(this.left_key) ? this.move_speed : 0;
        this.player.x += this.input.keyboard.checkDown(this.right_key) ? this.move_speed : 0;
    }
}