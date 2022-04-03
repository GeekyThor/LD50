import { Scene } from "phaser";
import { Input } from "phaser"
import { CANVAS_HEIGHT, CANVAS_WIDTH, HIGHLIGHT_COLOR, TEXT_COLOR } from "./consts";

export class DeathScene extends Scene {
    constructor() {
        super("DeathScene");
    }

    preload() {
        this.load.image("death-bg", "assets/death-screen-clear.png")
    }

    create() {
        this.background = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'death-bg');

        const play_again = this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 70, "Play Again", { fontSize: 40 });
        play_again.setOrigin(0.5, 0.5);
        this.makeTextInteractable(play_again, () => {
            this.scene.start("GameScene");
        });

        // This re-places it for the scrolling to occur
        this.children.list.forEach(child => {
            child.y += CANVAS_HEIGHT - 238
        });
        this.appearing = true;
    }

    update() {
        if (this.appearing) {
            this.children.list.forEach(child => {
                child.y -= Math.min(5, Math.abs((CANVAS_HEIGHT / 2) - this.background.y));
            });
            this.appearing = this.background.y > CANVAS_HEIGHT / 2;
        }
    }

    /**
     * Makes a text element interactable
     * @param {Phaser.GameObjects.Text} text 
     * @param {Function} callback 
     */
    makeTextInteractable(text, callback) {
        text.setInteractive();

        // Highlight on hover
        text.on(Input.Events.POINTER_OVER, () => {
            text.setColor(HIGHLIGHT_COLOR);
            text.setFontStyle("bold");
        });
        text.on(Input.Events.POINTER_OUT, () => {
            text.setColor(TEXT_COLOR);
            text.setFontStyle("");
        });

        text.on(Input.Events.POINTER_UP, callback)
    }
}