var webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    output: {
        library: "JuttleClientLibrary",
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.json$/,
                include: __dirname,
                loader: 'json'
            }
        ]
    }
}
