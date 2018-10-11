define('js/modules/about', function (require, exports, module) {
  var base = require('base');
  var about = {
    init: function () {
      console.log('about page');
    }
  };
  module.exports = about;
});
