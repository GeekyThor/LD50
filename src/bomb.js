export class TimedBomb {
    constructor(scene, x, y, sprite_name, bomb_width, mass, boom_radius, time_to_boom, worth, diffuse_worth) {
        this.scene = scene;
        this.mass = mass;
        this.boom_radius = boom_radius;
        this.worth = worth;
        this.diffuse_worth = diffuse_worth;
        
        this.bomb = scene.add.sprite(0, 0, sprite_name, 0);
        this.bomb.scale = bomb_width / this.bomb.width;
        
        this.bomb.anims.create({
            key: 'normal',
            frames: [ { key: sprite_name, frame: 0 }],
            frameRate: 4
        });
        this.bomb.anims.create({
            key: 'flashing',
            frames: this.bomb.anims.generateFrameNumbers(sprite_name, { start: 1, end: 2 }),
            frameRate: 4,
            repeat: -1
        });
        this.bomb.anims.create({
            key: 'diffused',
            frames: [ { key: sprite_name, frame: 3 }],
            frameRate: 4
        });
        this.bomb.anims.create({
            key: 'diffused-short',
            frames: [ { key: sprite_name, frame: 4 }],
            frameRate: 4
        });
        this.bomb.anims.play('normal');

        this.timer_time = time_to_boom;
        this.timer_text = scene.add.text(-5, -4, String(Math.ceil(this.timer_time)));

        this.container = scene.add.container(x, y, [ this.bomb, this.timer_text ]);
        this.container.setSize(this.bomb.width, this.bomb.height);
        scene.physics.world.enable(this.container);

        this.container.body.setGravityY(300);
        this.container.body.setMaxVelocityY(300);

        // Destroy colliders with player and other bombs after bomb explodes
        this.colliders = [this.scene.physics.add.collider(this.container, this.scene.player.container)];

        this.armed = true;
        this.boomed = false;

        if (this.timer_time == 1) {
            this.start_bomb_flashing();
        }

        this.timer_event = scene.time.addEvent({
            callback: this.bomb_tick,
            callbackScope: this,
            delay: 1000,
            loop: true
        });

        if (this.timer_time <= 0) {
            this.explode_bomb();
        }
    }

    bomb_tick() { 
        if (this.armed && !this.boomed) {
            this.timer_time -= 1;

            if (this.timer_time == 1) {
                this.start_bomb_flashing();
            }

            if (this.timer_time <= 0) {
                this.explode_bomb();
            } else {
                this.timer_text.text = String(Math.ceil(this.timer_time));
            }
        }
    }

    start_bomb_flashing() {
        this.bomb.anims.play('flashing', true);
    }

    explode_bomb() {
        this.timer_event.loop = false;

        this.explosion = this.scene.add.circle(this.container.x, this.container.y, this.boom_radius, 0xff8800, 0.5);
        this.scene.time.addEvent({
            callback: this.remove_explosion,
            callbackScope: this,
            delay: 200,
            loop: false
        });

        if (Phaser.Geom.Intersects.CircleToRectangle(
            new Phaser.Geom.Circle(this.container.x, this.container.y, this.boom_radius),
            this.scene.player.sprite.getBounds()
        )) {
            this.scene.player.hit();
        } else {
            this.scene.increase_score(this.worth);
        }
        
        this.boomed = true;
        for (var collider of this.colliders) {
            if (collider.world != null) {
                collider.destroy();
            }
        }
        this.container.destroy();
    }

    remove_explosion() {
        this.explosion.destroy();
    }

    update() {
        // Ground friction
        if (!this.boomed) {
            if (this.container.body.onFloor()) {
                if (Math.abs(this.container.body.velocity.x) < 100) {
                    this.container.body.setVelocityX(0);
                }
                this.container.body.setAccelerationX(-2000 * Math.sign(this.container.body.velocity.x)); 
            } else {
                this.container.body.setAccelerationX(0);
            }
        }
    }

    add_collision_with_bomb(bomb) {
        this.colliders.push(this.scene.physics.add.collider(this.container, bomb.container));
    }
}

export class OnImpactBomb {
    constructor(scene, x, y, sprite_name, bomb_width, boom_radius, worth) {
        this.scene = scene;
        this.boom_radius = boom_radius;
        this.worth = worth;
        
        this.bomb = scene.add.sprite(0, 0, sprite_name, 0);
        this.bomb.scale = bomb_width / this.bomb.width;
        
        this.container = scene.add.container(x, y, [ this.bomb ]);
        this.container.setSize(this.bomb.width, this.bomb.height);
        scene.physics.world.enable(this.container);

        this.container.body.setCircle(bomb_width / 2, 0, bomb_width / 2);
        this.container.body.setBounce(1);
        this.container.body.setGravityY(300);
        this.container.body.setMaxVelocityY(300);
        this.container.body.setCollideWorldBounds(true, 0.7, 0.7);

        // Destroy colliders with player and other bombs after bomb explodes
        this.colliders = [this.scene.physics.add.collider(this.container, this.scene.player.container, this.explode_bomb, null, this)];

        this.armed = true;
        this.boomed = false;
    }

    explode_bomb() {
        this.explosion = this.scene.add.circle(this.container.x, this.container.y, this.boom_radius, 0xff8800, 0.5);
        this.scene.time.addEvent({
            callback: this.remove_explosion,
            callbackScope: this,
            delay: 200,
            loop: false
        });

        if (Phaser.Geom.Intersects.CircleToRectangle(
            new Phaser.Geom.Circle(this.container.x, this.container.y, this.boom_radius),
            this.scene.player.sprite.getBounds()
        )) {
            this.scene.player.hit();
        } else {
            this.scene.increase_score(this.worth);
        }
        
        this.boomed = true;
        for (var collider of this.colliders) {
            if (collider.world != null) {
                collider.destroy();
            }
        }
        this.container.destroy();
    }

    remove_explosion() {
        this.explosion.destroy();
    }

    update() {
        // Ground friction
        if (!this.boomed) {
            if (this.container.body.onFloor()) {
                this.explode_bomb();
            }
        }
    }

    add_collision_with_bomb(bomb) {
        this.colliders.push(this.scene.physics.add.collider(this.container, bomb.container, this.explode_bomb, null, this));
    }
}

export class SmallBomb extends TimedBomb {
    constructor(scene, x, y) {
        var bomb_width = 15;
        super(scene, x, y, 'small_bomb', bomb_width, 0.5, 25, 5, 1, 5);
        this.container.body.setCircle(bomb_width / 2, 0, bomb_width / 2);
        this.container.body.setCollideWorldBounds(true, 0.7, 0.7);
        this.container.body.setBounce(1);
    }
}

export class SmallOnImpactBomb extends OnImpactBomb {
    constructor(scene, x, y) {
        var bomb_width = 5;
        super(scene, x, y, 'small-bomb', bomb_width, 25, 1);
        this.container.body.setCircle(bomb_width / 2, 0, bomb_width / 2);
        this.container.body.setCollideWorldBounds(true, 0.7, 0.7);
        this.container.body.setBounce(1);
    }
}

export class NukeBomb extends TimedBomb {
    constructor(scene, x, y) {
        super(scene, x, y, 'nuke_bomb', 30, 1000, 400, 10, 10, 20);
        this.container.body.setCollideWorldBounds(true, 0, 0);
        this.container.body.setBounce(0);
        this.container.body.pushable = false;
    }
}


