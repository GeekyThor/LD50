const Phaser = require('phaser');
const { GameScene } = require('./game-scene.js');
const Consts = require('./consts.js');
import { DeathScene } from './death-scene.js';
import { MainMenuScene } from './main-menu-scene.js';

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'content',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    width: Consts.CANVAS_WIDTH,
    height: Consts.CANVAS_HEIGHT,
    scene: [MainMenuScene, GameScene, DeathScene]
}

const game = new Phaser.Game(gameConfig);
