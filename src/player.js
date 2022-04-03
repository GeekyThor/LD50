import { ProgressBar } from "./progressbar";
const Consts = require('./consts.js');
export class Player {
    constructor(scene, move_speed, hp, throw_vel, diffuse_time)
    {
        this.scene = scene;
        this.move_speed = move_speed;
        this.hp = hp;
        this.max_hp = hp;
        this.throw_vel = throw_vel;
        this.diffuse_time = diffuse_time;

        this.health_bar = new ProgressBar(scene, 10, 10, 300, 20, 3, 0xff2d00, 0x222222);
        this.health_bar.update(1);
        this.diffuse_bar = null;
        
        this.sprite = this.scene.physics.add.sprite(0, 0, 'player', 0);
        this.hands_up = this.scene.add.image(0, -this.sprite.height / 2, 'player-handsup', 0);

        this.container = scene.add.container(
            Consts.CANVAS_WIDTH / 2,
            Consts.CANVAS_HEIGHT - Consts.GROUND_HEIGHT - this.sprite.height / 2,
            [ this.sprite, this.hands_up ]);
        this.container.setSize(this.sprite.width, this.sprite.height);
        this.scene.physics.world.enable(this.container);
        this.scene.physics.add.collider(this.container, this.scene.ground);
        this.container.body.setCollideWorldBounds(true, 0, 0);
        this.container.body.setGravityY(300);

        this.sprite.anims.create({
            key: 'idle',
            frames: [ { key: 'player', frame: 0 }],
            frameRate: 5
        })
        this.sprite.anims.create({
            key: 'right',
            frames: this.sprite.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
            frameRate: 5,
            repeat: -1
        });
        this.sprite.anims.create({
            key: 'left',
            frames: this.sprite.anims.generateFrameNumbers('player', { start: 3, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.sprite.anims.create({
            key: 'idle-hold',
            frames: [ { key: 'player', frame: 5 }],
            frameRate: 5
        })
        this.sprite.anims.create({
            key: 'right-hold',
            frames: this.sprite.anims.generateFrameNumbers('player', { start: 6, end: 7 }),
            frameRate: 5,
            repeat: -1
        });
        this.sprite.anims.create({
            key: 'left-hold',
            frames: this.sprite.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
            frameRate: 5,
            repeat: -1
        });

        this.picked_up = null;
        this.diffuse_timer = null;
        
        this.left_key = scene.input.keyboard.addKey('A');
        this.right_key = scene.input.keyboard.addKey('D');
        this.up_key = scene.input.keyboard.addKey('W');
        this.pickup_key = scene.input.keyboard.addKey('SPACE');
    }

    get_closest_bomb()
    {
        var closest = null;
        var min_distance = null;
        for (const bomb of this.scene.bombs) {
            // Prevents the player from trying to pick up an exploded bomb
            if (!bomb.boomed) {
                var distance = Phaser.Math.Distance.Between(bomb.container.x, bomb.container.y, this.container.x, this.container.y);
                
                if (closest == null)
                {
                    closest = bomb;
                    min_distance = distance;
                }

                if (distance < min_distance)
                {
                    closest = bomb;
                    min_distance = distance;
                }
            }
        }

        return [closest, min_distance];
    }

    handle_pickup()
    {
        if (this.picked_up != null) {
            // In case a bomb exploded while holding it
            if (this.picked_up.boomed) {
                this.picked_up = null;
            } else {
                return;
            }
        }
        
        var closest = this.get_closest_bomb();
        if (closest[1] != null && closest[1] <= 30)
        {
            this.picked_up = closest[0];

            this.picked_up.container.body.setGravityY(0);
            this.picked_up.container.body.setVelocity(this.container.body.velocity.x, this.container.body.velocity.y);
            this.picked_up.container.x = this.container.x;
            this.picked_up.container.y = this.container.y - this.sprite.height / 2 - this.picked_up.container.height / 2;
            if (!this.picked_up.armed)
                return;
            this.diffuse_timer = this.scene.time.addEvent({
                callback: this.diffuse,
                callbackScope: this,
                delay: this.diffuse_time,
                loop: false
            });;
            this.diffuse_bar = new ProgressBar(this.scene, this.container.x, this.container.y, Consts.PLAYER_WIDTH + 10, 10, 0.8, 0x40d300, 0x222222);
        }
    }

    handle_throw()
    {
        if (this.picked_up == null)
            return;

        // In case a bomb exploded while holding it
        if (this.picked_up.boomed) {
            this.picked_up = null;
            return;
        }
        
        var throw_angle = -Phaser.Math.Angle.Between(this.container.x, this.container.y, this.scene.input.activePointer.x, this.scene.input.activePointer.y) + Math.PI / 2;
        this.picked_up.container.body.setVelocity(
            Math.sin(throw_angle) * this.throw_vel,
            Math.cos(throw_angle) * this.throw_vel
        )
        this.picked_up.container.body.setGravityY(300);

        this.picked_up = null;
        if (this.diffuse_timer != null)
            this.diffuse_timer.remove();
        if (this.diffuse_bar != null)
        {
            this.diffuse_bar.destroy();
            this.diffuse_bar = null;
        }
    }

    diffuse()
    {
        if (this.picked_up != null) {
            if (this.picked_up.armed && !this.picked_up.boomed) {
                this.picked_up.armed = false;
                this.scene.increase_score(this.picked_up.worth);
                if (this.picked_up.timer_time > 1) {
                    this.picked_up.bomb.anims.play('diffused');
                } else {
                    this.picked_up.bomb.anims.play('diffused-short');
                }
            }
        }
    }

    update_diffuse_bar_pos()
    {
        this.diffuse_bar.x = this.container.x - Consts.PLAYER_WIDTH / 2 - 5;
        this.diffuse_bar.y = this.container.y - Consts.PLAYER_HEIGHT - 23;
    }

    update()
    {
        // Pickup
        if (this.scene.input.keyboard.checkDown(this.pickup_key))
        {
            this.handle_pickup();
        }
        if (this.picked_up != null)
        {
            if (this.picked_up.boomed) {
                this.picked_up = null;
                this.diffuse_bar.destroy();
                this.diffuse_bar = null;
                this.picked_up = null;
            } else {
                this.picked_up.container.body.setVelocity(this.container.body.velocity.x, this.container.body.velocity.y);
                this.picked_up.container.x = this.container.x;
                this.picked_up.container.y = this.container.y - this.sprite.height / 2 - this.picked_up.container.height / 2;
            }
        }

        // Throw
        if (this.scene.input.activePointer.leftButtonDown())
        {
            this.handle_throw();
        }

        // Movement
        if (this.scene.input.keyboard.checkDown(this.left_key)) {
            this.container.body.setVelocityX(-this.move_speed);
            if (this.picked_up == null) {
                this.sprite.anims.play('left', true);
                this.hands_up.setAlpha(0);
            } else {
                this.sprite.anims.play('left-hold', true);
                this.hands_up.setAlpha(1);

            }
        } else if (this.scene.input.keyboard.checkDown(this.right_key)) {
            this.container.body.setVelocityX(this.move_speed);
            if (this.picked_up == null) {
                this.sprite.anims.play('right', true);
                this.hands_up.setAlpha(0);
            } else {
                this.sprite.anims.play('right-hold', true);
                this.hands_up.setAlpha(1);
            }
        } else {
            this.container.body.setVelocityX(0);
            if (this.picked_up == null) {
                this.sprite.anims.play('idle');
                this.hands_up.setAlpha(0);
            } else {
                this.sprite.anims.play('idle-hold');
                this.hands_up.setAlpha(1);
            }
        }
        if (this.scene.input.keyboard.checkDown(this.up_key) && this.container.body.onFloor())
        {
            this.container.body.setVelocityY(-200);
        }

        // Diffuse
        if (this.diffuse_bar != null)
        {
            this.update_diffuse_bar_pos()
            this.diffuse_bar.update(this.diffuse_timer.getOverallProgress());
        }
    }

    hit() {
        if (this.hp > 0) {
            this.hp -= 1;
            console.log("Remaining hp: ", this.hp);
            this.health_bar.update(this.hp / this.max_hp);
        }
        if (this.hp == 0) {
            console.log("Game over!");
        }
    }
}
