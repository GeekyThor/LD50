import Phaser from "phaser";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./consts";

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {
        this.load.image('menu-bg', 'assets/main-menu.png');
    }

    create() {
        this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'menu-bg');

        const start_game_title = this.add.text(30, 300, 'START', { fontSize: 40, fontFamily: "Arial" });
        // start_game_title.input = true;
        start_game_title.setInteractive();
        start_game_title.on(Phaser.Input.Events.POINTER_OVER, e => {
            start_game_title.setStyle({
                color: "gold",
                fontSize: 45,
            });
        });
        start_game_title.on(Phaser.Input.Events.POINTER_OUT, () => {
            start_game_title.setStyle({
                color: "white",
                fontSize: 40,
            })
        });
        start_game_title.on(Phaser.Input.Events.POINTER_UP, () => {
            this.scene.start("GameScene");
        });
    }
}