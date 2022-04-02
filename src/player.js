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
        this.scene.physics.add.collider(sprite, scene.ground)
        this.sprite.setGravityY(300);
        this.left_key = scene.input.keyboard.addKey('left');
        this.right_key = scene.input.keyboard.addKey('right');
        this.up_key = scene.input.keyboard.addKey('up');
        this.pickup_key = scene.input.keyboard.addKey('F');
    }

    get_closest_bomb()
    {
        var closest = null;
        var min_distance = null;
        for (const bomb of this.scene.bomb_group.getChildren()) {
            var distance = Phaser.Math.Distance.Between(bomb.x, bomb.y, this.sprite.x, this.sprite.y);
            
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
        if (closest[1] == null || closest[1] > 10)
            console.log("No pickup");
        else
            this.picked_up = closest[0];
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

        // pickup
        if (this.scene.input.keyboard.checkDown(this.pickup_key))
        {
            this.handle_pickup();
        }
        if (this.picked_up != null)
        {
            this.picked_up.x = this.sprite.x;
            this.picked_up.y = this.sprite.y;
        }
    }
}