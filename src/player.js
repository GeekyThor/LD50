export class Player {

    constructor(scene, sprite, move_speed, hp, throw_vel, diffuse_time)
    {
        this.scene = scene;
        this.sprite = sprite;
        this.move_speed = move_speed;
        this.hp = hp;
        this.throw_vel = throw_vel;
        this.diffuse_time = diffuse_time;
        
        this.scene.physics.add.collider(sprite, scene.ground)
        this.sprite.setGravityY(300);
        this.left_key = scene.input.keyboard.addKey('left');
        this.right_key = scene.input.keyboard.addKey('right');
        this.up_key = scene.input.keyboard.addKey('up');
    }

    update()
    {
        // Movement
        this.sprite.x -= this.scene.input.keyboard.checkDown(this.left_key) ? this.move_speed : 0;
        this.sprite.x += this.scene.input.keyboard.checkDown(this.right_key) ? this.move_speed : 0;
        if (this.scene.input.keyboard.checkDown(this.up_key) && this.sprite.body.touching.down)
        {
            this.sprite.setVelocityY(-200)
        }
    }
}