const Phaser = require('phaser');
const { GameScene } = require('./game-scene.js');
const Consts = require('./consts.js');

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'content',
    physics: {
        default: 'arcade',
        arcade: { debug:false }
    },
    width: Consts.CANVAS_WIDTH,
    height: Consts.CANVAS_HEIGHT,
    scene: [ GameScene ]
}

const game = new Phaser.Game(gameConfig);
