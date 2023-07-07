module.exports = function (webpackEnv) {
    resolve = {
        fallback: {
            "fs": require.resolve(""),
            "stream": require.resolve("stream-browserify")
        }
    }
    target: 'node' 
    