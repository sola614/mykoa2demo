const Koa = require("koa");
const views = require("koa-views");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const config = require("./config");
const fs = require("fs");
const path = require("path");
const loginCheck = require("./middleware/loginCheck");
const minify = require("./middleware/minify");
const helmet = require("koa-helmet");
const Redis = require("ioredis");
const cache = require('koa-router-cache');
require("./swigConfig");

let {
  port,
  rds,
  env,
  apiPath,
  staticPath
} = config;
const version = env === "dev" ? "" : `?v=${+new Date()}`;
const redis = (global.redis = new Redis(rds));
const RedisCache = cache.RedisCache(redis);
const server = (global.server = new Koa());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

async function onerror(ctx, next) {
  try {
    if (/\/\//ig.test(ctx.path)) {
      console.log(`=== error url === ${ctx.path}`);
      const url = ctx.url.replace(/[\/\\\\]{2,}/, '/');
      ctx.redirect(url);
      return;
    }
    await next();
  } catch (err) {
    ctx.app.emit('error', err);
    await ctx.render('500');
    ctx.status = err.status || 500;
  }
}
server.use(onerror);

server.use(
  helmet({
    frameguard: false
  })
);
server.use(bodyparser());
if (env == "dev") {
  // 合并http请求
  const combo = require('./middleware/combo');
  server.use(combo({
    base: './assets'
  }));
  // 静态资源路径
  server.use(require("koa-static")(path.join(__dirname, "../assets")));
  // 代理设置
  const proxy = require("koa-proxy");
  server.use(
    proxy({
      host: "http://192.168.1.133", //服务地址
      match: /^\/(iapi)/ //匹配字段
    })
  );
  server.use(
    proxy({
      host: "http://192.168.1.133",
      match: /^\/(ucenter)/
    })
  );
  require("./mocks"); //本地自定义api
} else {
  // server.use(logger());
}
if (env != 'dev') {
  // 静态html 缓存了首页
  server.use(cache(server, {
    'GET /': {
      key: 'page:index', //存在redis的key值
      expire: 86400000,
      get: RedisCache.get,
      set: RedisCache.set,
      passthrough: RedisCache.passthrough,
      evtName: 'clearIndexCache',
      destroy: RedisCache.destroy
    }
  }));
}
server.use(
  views(path.resolve(__dirname, "./views"), {
    map: {
      html: "swig"
    }
  })
);
//注入全局变量
server.use(async (ctx, next) => {
  ctx.state = {
    site: Object.assign({}, config.site),
    cache: 'memory',
    apiPath,
    staticPath
  };
  await next();
});
// server.use(loginCheck); //使用自定义中间件
require(`./routes`); //引入路由

require("./schedule"); //使用定时任务
//判断状态
server.use(async (ctx, next) => {
  if (ctx.status === 404) {
    await ctx.render('404');
    ctx.status = 404;
  }
  if (ctx.status === 500) {
    await ctx.render('500');
    ctx.status = 500;
    console.error(ctx.error);
  }
  return await next();
});
server.use(minify); //压缩html
server.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
module.exports = server;
