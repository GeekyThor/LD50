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
        this.ground = this.physics.add.sprite(400, 550, 'ground');
        this.ground.setImmovable();
        this.player = this.add.image(400, 495, 'player');
        this.bomb = this.physics.add.sprite(400, 300, 'bomb');
        this.bomb.setBounce(0.3)
        this.bomb.setGravityY(100);
        this.physics.add.collider(this.bomb, this.ground);
        this.left_key = this.input.keyboard.addKey('left');
        this.right_key = this.input.keyboard.addKey('right');
    }

    update() {
        this.player.x -= this.input.keyboard.checkDown(this.left_key) ? this.move_speed : 0;
        this.player.x += this.input.keyboard.checkDown(this.right_key) ? this.move_speed : 0;
    }
}