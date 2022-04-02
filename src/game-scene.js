export class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('geekythor', 'assets/geekythor.jpg');
    }

    create() {
        this.add.image(400, 300, 'geekythor');
    }
}