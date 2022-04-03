const Consts = require('./consts.js');

export class Player {
    constructor(scene, move_speed, hp, throw_vel, diffuse_time)
    {
        this.scene = scene;
        this.move_speed = move_speed;
        this.hp = hp;
        this.throw_vel = throw_vel;
        this.diffuse_time = diffuse_time;
        
        this.sprite = this.scene.physics.add.sprite(
            Consts.CANVAS_WIDTH / 2, 
            Consts.CANVAS_HEIGHT - scene.ground.height, 
            'player',
            0);
        this.sprite.y -= this.sprite.height / 2;
        this.sprite.setGravityY(300);
        this.scene.physics.world.enable(this.sprite);
        this.scene.physics.add.collider(this.sprite, this.scene.ground);

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
                var distance = Phaser.Math.Distance.Between(bomb.container.x, bomb.container.y, this.sprite.x, this.sprite.y);
                
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
        if (closest[1] != null && closest[1] <= 10)
        {
            this.picked_up = closest[0];

            this.picked_up.container.body.setGravityY(0);
            this.picked_up.container.body.stop();
            this.picked_up.container.x = this.sprite.x;
            this.picked_up.container.y = this.sprite.y - this.sprite.height / 2 - this.picked_up.container.height / 2;

            this.diffuse_timer = this.scene.time.addEvent({
                callback: this.diffuse,
                callbackScope: this,
                delay: this.diffuse_time,
                loop: false
            });;
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
        
        var throw_angle = -Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, this.scene.input.activePointer.x, this.scene.input.activePointer.y) + Math.PI / 2;
        this.picked_up.container.body.setVelocity(
            Math.sin(throw_angle) * this.throw_vel,
            Math.cos(throw_angle) * this.throw_vel
        )
        this.picked_up.container.body.setGravityY(300);

        this.picked_up = null;
        if (this.diffuse_timer != null)
            this.diffuse_timer.remove();
    }

    diffuse()
    {
        if (this.picked_up != null) {
            if (this.picked_up.armed && !this.picked_up.boomed) {
                this.picked_up.armed = false;
                console.log("Diffuse!");
            }
        } 
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
            this.picked_up.container.x = this.sprite.x;
            this.picked_up.container.y = this.sprite.y - this.sprite.height / 2 - this.picked_up.container.height / 2;
        }    

        // Throw
        if (this.scene.input.activePointer.leftButtonDown())
        {
            this.handle_throw();
        }

        // Diffuse

        // Movement
        if (this.scene.input.keyboard.checkDown(this.left_key)) {
            this.sprite.setVelocityX(-this.move_speed);
            if (this.picked_up == null) {
                this.sprite.anims.play('left', true);
            } else {
                this.sprite.anims.play('left-hold', true);
            }
        } else if (this.scene.input.keyboard.checkDown(this.right_key)) {
            this.sprite.setVelocityX(this.move_speed);
            if (this.picked_up == null) {
                this.sprite.anims.play('right', true);
            } else {
                this.sprite.anims.play('right-hold', true);
            }
        } else {
            this.sprite.setVelocityX(0);
            if (this.picked_up == null) {
                this.sprite.anims.play('idle');
            } else {
                this.sprite.anims.play('idle-hold');
            }
        }
        if (this.scene.input.keyboard.checkDown(this.up_key) && this.sprite.body.touching.down)
        {
            this.sprite.setVelocityY(-200);
        }
    }

    hit() {
        if (this.hp > 0) {
            this.hp -= 1;
            console.log("Remaining hp: ", this.hp);
        }
        if (this.hp == 0) {
            console.log("Game over!");
        }
    }
}