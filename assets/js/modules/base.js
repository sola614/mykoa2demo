define('js/modules/base', function (require, exports, module) {
  var Base = {
    utils: {
      init: function () {
        //do something
        console.log('base');

      }
    }
  };
  Base.utils.init();
  module.exports = Base;
});
