import { ProgressBar } from "./progressbar";
const Consts = require('./consts.js');

export class Player {

    constructor(scene, sprite, move_speed, hp, throw_vel, diffuse_time)
    {
        this.scene = scene;
        this.sprite = sprite;
        this.move_speed = move_speed;
        this.hp = hp;
        this.max_hp = hp;
        this.throw_vel = throw_vel;
        this.diffuse_time = diffuse_time;

        this.health_bar = new ProgressBar(scene, (Consts.CANVAS_WIDTH - 300) / 2, Consts.CANVAS_HEIGHT - 60, 300, 20, 0xff2d00, 0x222222);
        this.health_bar.update(1);
        
        this.picked_up = null;
        this.diffuse_timer = null;
        this.scene.physics.add.collider(sprite, scene.ground);
        this.sprite.setGravityY(300);
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
            this.picked_up.container.x = this.sprite.x;
            this.picked_up.container.y = this.sprite.y - 20;

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
        // Movement
        this.sprite.x -= this.scene.input.keyboard.checkDown(this.left_key) ? this.move_speed : 0;
        this.sprite.x += this.scene.input.keyboard.checkDown(this.right_key) ? this.move_speed : 0;
        if (this.scene.input.keyboard.checkDown(this.up_key) && this.sprite.body.touching.down)
        {
            this.sprite.setVelocityY(-200);
        }

        // Pickup
        if (this.scene.input.keyboard.checkDown(this.pickup_key))
        {
            this.handle_pickup();
        }
        if (this.picked_up != null)
        {
            this.picked_up.container.x = this.sprite.x;
            this.picked_up.container.y = this.sprite.y - 20;
        }

        // Throw
        if (this.scene.input.activePointer.leftButtonDown())
        {
            this.handle_throw();
        }

        // Diffuse
    }

    hit() {
        if (this.hp > 0) {
            this.hp -= 1;
            console.log("Remaining hp: ", this.hp);
            this.health_bar.update(this.hp / this.max_hp)
        }
        if (this.hp == 0) {
            console.log("Game over!");
        }
    }
}