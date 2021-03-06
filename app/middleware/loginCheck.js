const axios = require('axios');
const config = require('../config');

async function checkLimitPage(ctx, next) {
  //一些需要登录的页面没有登录则跳转登录页
  let path = ctx.path;
  if (path === 'login.html') {
    return;
  }
  let keyReg = /member/i;
  let otherReg = /onlinePay/i; //例外情况
  if (keyReg.test(path) && !otherReg.test(path)) {
    ctx.redirect(config.tlsDomain + '/login.html?rurl=' + encodeURIComponent(config.domain + path + ctx.search));
  } else {
    return await next();
  }
}

module.exports = async function (ctx, next) {
  let path = ctx.path;
  if (path === '/' || ((/\/about\/|news-/i).test(path) && path.indexOf('news-5') === -1) || path === '/sso/login' || path === '/qqcb' || path === '/testwx' || path === '/wx') {
    await next();
    return;
  }
  let apiPath = config.apiPath;
  let cookies = ctx.cookies;
  let userInfo = null;
  ctx.userInfo = null;
  ctx.state.userInfo = null;
  if (!cookies.get('usid') && !cookies.get('remindMe')) {
    await checkLimitPage(ctx, next);
    return;
  }
  let res = await axios.post(apiPath + '/ucenter/getLoginUserInfo', {}, {
    headers: {
      cookie: ctx.req.headers.cookie || []
    }
  }).then((response) => {
    return response;
  }).catch(async (err) => {
    throw new Error(err);
  });
  if (cookies.get('remindMe') && !cookies.get('usid')) {
    let setCookie = res.headers['set-cookie'];
    if (setCookie) {
      for (var i = 0; i < setCookie.length; i++) {
        let key = setCookie[i].split('=')[0];
        if (key == 'usid') {
          ctx.cookies.set(key, setCookie[i].split('=')[1], {
            'domain': '.allchips.com',
            'path': '/'
          });
          break;
        }
      }
    }
    ctx.redirect(config.tlsDomain + '/sso/login?rurl=' + encodeURIComponent(config.domain + path + ctx.search));
    return;
  }

  res = res.data;
  if (res && res.code == 0) {
    let {
      userId,
      userName,
      mobile,
      email,
      qq,
      tel,
      id,
      createTime
    } = res.data.user;
    userInfo = {
      userId,
      userName,
      mobile,
      email,
      qq,
      tel,
      id,
      createTime
    }
  } else {
    await checkLimitPage(ctx, next);
    return;
  }
  ctx.userInfo = userInfo;
  ctx.state.userInfo = userInfo;
  await next();
}
