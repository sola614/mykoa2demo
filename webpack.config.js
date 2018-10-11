var SpritesmithPlugin = require('webpack-spritesmith');
var path = require('path');

module.exports = {
  module: {
    rules: [{
      test: /\.png$/,
      use: [
        'file-loader?name=i/[hash].[ext]'
      ]
    }]
  },
  resolve: {
    modules: ["node_modules", "spritesmith-generated"]
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, './assets/images/icon'), //要生成的文件路径
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, './assets/images/sprite-icon.png'), //生成图片文件路径名称
        css: path.resolve(__dirname, './assets/css/sprite-icon.css') //生成css文件路径名称
      },
      apiOptions: {
        cssImageRef: '../images/sprite-icon.png'
      },
      spritesmithOptions: {
        algorithm: 'top-down'
      }
    })
  ]
}
