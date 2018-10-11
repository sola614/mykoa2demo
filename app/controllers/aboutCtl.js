const {
  request
} = require('./public');
module.exports = async function (ctx, next) {
  console.log('aboutctl');
  await ctx.render('about', {
    page: 'about'
  });
  await next();
};
