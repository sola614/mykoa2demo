const {
  request
} = require('./public');
module.exports = async function (ctx, next) {
  console.log('indexCtl');
  await ctx.render('index', {
    page: 'index'
  });
  await next();
};
