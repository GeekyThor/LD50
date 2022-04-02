const Consts = require('./consts.js');
const { Player } = require('./player.js');
const { SmallBomb } = require('./bomb.js');

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

        var player_sprite = this.physics.add.sprite(
            Consts.CANVAS_WIDTH / 2, 
            Consts.CANVAS_HEIGHT - this.ground.height - PLAYER_HEIGHT / 2, 
            'player');
        player_sprite.scale = PLAYER_HEIGHT / player_sprite.height;
        this.player = new Player(this, player_sprite, 3, 5, 5, 5);

        this.bomb_group = this.add.group();
        this.bomb = new SmallBomb(this, Consts.CANVAS_WIDTH / 2, Consts.CANVAS_HEIGHT / 2);
        this.bomb_group.add(this.bomb.container);

        this.left_key = this.input.keyboard.addKey('left');
        this.right_key = this.input.keyboard.addKey('right');
    }

    update() {
        this.player.update();
    }
}