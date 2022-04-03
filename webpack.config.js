const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve('./dist'),
        filename: 'game.js'
    },
    devServer: {
        static: path.resolve('./dist')
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }    
}
