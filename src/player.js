export class Player {

    constructor(scene, sprite, move_speed, hp, throw_vel, diffuse_time)
    {
        this.scene = scene;
        this.sprite = sprite;
        this.move_speed = move_speed;
        this.hp = hp;
        this.throw_vel = throw_vel;
        this.diffuse_time = diffuse_time;
        
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

        return [closest, min_distance];
    }

    handle_pickup()
    {
        if (this.picked_up != null)
            return;
        
        var closest = this.get_closest_bomb();
        if (closest[1] != null && closest[1] <= 10)
        {
            this.picked_up = closest[0];

            this.picked_up.container.body.setGravityY(0);
            this.picked_up.container.x = this.sprite.x;
            this.picked_up.container.y = this.sprite.y;

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
            this.picked_up.container.y = this.sprite.y;
        }

        // Throw
        if (this.scene.input.activePointer.leftButtonDown())
        {
            this.handle_throw();
        }

        // Diffuse
    }
}