if (typeof jsVersion == "undefined") {
  var jsVersion = "?v=201712201110";
} else {
  // jsVersion=jsVersion.replace("?","");
}
// seajs.debug = true;
seajs.config({
  base: staticPath + "/",
  alias: { //别名配置
    "combo": "seajs/combo",
    "base": "js/modules/base.js",
  },
  map: [
    [/^(.*\/js\/modules\/.*\.(?:css|js))(?:.*)$/i, "$1" + jsVersion]
  ],
  debug: true,
  charset: "utf-8"
});
