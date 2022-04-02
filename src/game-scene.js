const { Player } = require('./player.js');
const { Bomb } = require('./bomb.js');

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
        this.player = new Player(this, this.physics.add.sprite(400, 495, 'player'), 3, 5, 200, 5);
        this.bomb_group = this.add.group();
        this.bomb = new Bomb(this, this.physics.add.sprite(400, 300, 'bomb'), 5000)
        this.bomb_group.add(this.bomb.sprite);
    }

    update() {
        this.player.update()
    }
}