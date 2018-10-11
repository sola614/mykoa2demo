// koa路由文件
const config = require("./config");
const router = new require("koa-router")({
  prefix: "" // config.sitePath//添加前缀
});
//404
// const error404=require('./controllers/error404');
//路由设置
router.get("/", require('./controllers/indexCtl'));
router.get("/about", require('./controllers/aboutCtl'));

server.use(router.routes()).use(router.allowedMethods());
