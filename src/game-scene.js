const Consts = require('./consts.js');
const { Player } = require('./player.js');
const { SmallBomb } = require('./bomb.js');

const PLAYER_HEIGHT = 20;

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 21, frameHeight: 17 });
        this.load.image('player-handsup', 'assets/player-handsup.png');
        this.load.spritesheet('small_bomb', 'assets/bombs/small.png', { frameWidth: 15, frameHeight: 20 });
    }

    create() {
        this.add.image(Consts.CANVAS_WIDTH / 2, Consts.CANVAS_HEIGHT / 2, 'bg');

        this.ground = this.physics.add.sprite(Consts.CANVAS_WIDTH / 2, Consts.CANVAS_HEIGHT, 'ground');
        this.ground.y -= this.ground.height / 2;
        this.ground.setImmovable();

        this.physics.world.setBounds(0, 0, Consts.CANVAS_WIDTH, Consts.CANVAS_HEIGHT - this.ground.height);

        this.player = new Player(this, 150, 5, 400, 2000);

        this.bombs = [];

        this.bomb_spawn_event = this.time.addEvent({
            callback: this.spawn_bomb,
            callbackScope: this,
            delay: 500,
            loop: true
        });
    }

    update() {
        this.player.update();

        var new_bombs = [];
        for (var bomb of this.bombs) {
            bomb.update();
            if (!bomb.boomed) {
                new_bombs.push(bomb);
            }
        }
        this.bombs = new_bombs;
    }

    spawn_bomb() {
        var new_bomb = new SmallBomb(this, Phaser.Math.Between(20, Consts.CANVAS_WIDTH - 20), -20);
        for (var bomb of this.bombs) {
            var collider = this.physics.add.collider(new_bomb.container, bomb.container);
            new_bomb.colliders.push(collider);
            bomb.colliders.push(collider);
        }
        this.bombs.push(new_bomb);
    }
}