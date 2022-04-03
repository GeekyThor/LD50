const Consts = require('./consts.js');
const { Player } = require('./player.js');
const { SmallBomb } = require('./bomb.js');

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 21, frameHeight: 17 });
        this.load.image('player-handsup', 'assets/player-handsup.png');
        this.load.spritesheet('small_bomb', 'assets/bombs/small.png', { frameWidth: 15, frameHeight: 20 });
    }

    create() {
        this.add.image(Consts.CANVAS_WIDTH / 2, Consts.CANVAS_HEIGHT / 2, 'background');

        this.physics.world.setBounds(0, 0, Consts.CANVAS_WIDTH, Consts.CANVAS_HEIGHT - Consts.GROUND_HEIGHT);

        this.score = 0;
        var score_text_1 = this.add.text(Consts.CANVAS_WIDTH - 10, 5, 'Score:', { fontSize: 40, fontFamily: "Arial" });
        this.score_text_2 = this.add.text(Consts.CANVAS_WIDTH - 10, score_text_1.y + score_text_1.height + 5, this.score, { fontSize: 40, fontFamily: "Arial" });
        score_text_1.setOrigin(1, 0);
        this.score_text_2.setOrigin(1, 0);

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
        var player_collider = this.physics.add.collider(new_bomb.container, this.player.container);
        new_bomb.colliders.push(player_collider);
        this.bombs.push(new_bomb);
    }

    increase_score(number) {
        this.score += number;
        this.score_text_2.setText(this.score);
    }
}