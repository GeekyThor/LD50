const Consts = require('./consts.js');
const { Bomb } = require('./bomb.js');

const PLAYER_HEIGHT = 20;

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.move_speed = 3;
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('player', 'assets/player.png');
        
        this.load.spritesheet('small_bomb', 'assets/bombs/small.png', { frameWidth: 15, frameHeight: 20 });
    }

    create() {
        this.add.image(Consts.CANVAS_WIDTH / 2, Consts.CANVAS_HEIGHT / 2, 'bg');

        this.ground = this.physics.add.sprite(Consts.CANVAS_WIDTH / 2, Consts.CANVAS_HEIGHT, 'ground');
        this.ground.y -= this.ground.height / 2;
        this.ground.setImmovable();

        this.player = this.add.image(
            Consts.CANVAS_WIDTH / 2, 
            Consts.CANVAS_HEIGHT - this.ground.height - PLAYER_HEIGHT / 2, 
            'player');
        this.player.scale = PLAYER_HEIGHT / this.player.height;

        var bomb_sprite = this.physics.add.sprite(Consts.CANVAS_WIDTH / 2, Consts.CANVAS_HEIGHT / 2, 'small_bomb');
        this.bomb = new Bomb(this, bomb_sprite, 5000);

        this.left_key = this.input.keyboard.addKey('left');
        this.right_key = this.input.keyboard.addKey('right');
    }

    update() {
        this.player.x -= this.input.keyboard.checkDown(this.left_key) ? this.move_speed : 0;
        this.player.x += this.input.keyboard.checkDown(this.right_key) ? this.move_speed : 0;
    }
}