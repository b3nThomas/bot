const path = require('path');

module.exports = {
    entry: './main.js',
    mode: 'development',
    node: {
        fs: 'empty'
    },
    output: {
        filename: 'bottom.js',
        path: path.resolve(__dirname, 'public')
    }
};
