const config = require("./config");
const swig = require("swig");
const {
  env,
  port
} = config;

swig.setFilter('trim', function (a, b) {
  return a.replace(/(^\s*)|(\s*$)/g, '');
});

swig.setFilter("setPicUrl", function (url) {
  if (url) {
    if (!/^http/.test(url)) {
      return url;
    } else {
      return url;
    }
  } else {
    return "";
  }
});
