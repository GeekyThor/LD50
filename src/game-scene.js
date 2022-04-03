import { BombGameContext, BombGenerator } from './bomb-generator.js';

const Consts = require('./consts.js');
const { Player } = require('./player.js');
const { SmallBomb, SmallOnImpactBomb, NukeBomb } = require('./bomb.js');

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');

        this.bomb_generator = new BombGenerator([
            new BombGameContext(null, 0, 9, 0),
            new BombGameContext(SmallOnImpactBomb, 0, 0.1, 0.05),
            new BombGameContext(SmallBomb, 0, 0.05, 0.05),
            new BombGameContext(NukeBomb, 20, 0.001, 0.001)
        ]);
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 21, frameHeight: 17 });
        this.load.image('player-handsup', 'assets/player-handsup.png');
        this.load.spritesheet('small_bomb', 'assets/bombs/small.png', { frameWidth: 15, frameHeight: 20 });
        this.load.spritesheet('nuke_bomb', 'assets/bombs/nuke.png', { frameWidth: 30, frameHeight: 56 });
    }

    create() {
        this.add.image(Consts.CANVAS_WIDTH / 2, Consts.CANVAS_HEIGHT / 2, 'background');

        this.physics.world.setBounds(0, 0, Consts.CANVAS_WIDTH, Consts.CANVAS_HEIGHT - Consts.GROUND_HEIGHT);

        this.elapsed_time = 0.0;

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
            delay: 50,
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
        var bomb_class = this.bomb_generator.get_next(this.elapsed_time);
        this.elapsed_time += 0.05;
        if (bomb_class == null)
            return;
        var new_bomb = new bomb_class(this, Phaser.Math.Between(20, Consts.CANVAS_WIDTH - 20), -20);
        for (var bomb of this.bombs) {
            new_bomb.add_collision_with_bomb(bomb);
            bomb.add_collision_with_bomb(new_bomb);
        }
        this.bombs.push(new_bomb);
    }

    increase_score(number) {
        if (this.player.is_alive) {
            this.score += number;
            this.score_text_2.setText(this.score);
        }
    }
}