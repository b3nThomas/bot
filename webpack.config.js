const path = require('path');

module.exports = {
    entry: './main.js',
    mode: 'development',
    output: {
        filename: 'bottom.js',
        path: path.resolve(__dirname, 'public')
    }
};
