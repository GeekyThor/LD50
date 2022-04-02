const Phaser = require('phaser');
const { GameScene } = require('./game-scene.js');

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'content',
    physics: {
        default: 'arcade',
        arcade: { debug:false }
    },
    width: 800,
    height: 600,
    scene: [ GameScene ]
}

const game = new Phaser.Game(gameConfig);
