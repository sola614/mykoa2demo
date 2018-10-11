const schedule = require('node-schedule');
const axios = require('axios');
const config = require('./config');
// 定时任务
function updateIndexCache() {
  redis.del('page:index').then(() => {
    axios.get(`https:${config.domain}`);
  });
}
schedule.scheduleJob('10 * * * * *', function () {
  console.log('======定时任务执行====');
});
// s m h d M wd/ 秒 分 时 日期 月份 周几 不填就是*
// schedule.scheduleJob('0 0 23 * * *', function () {
//   axios.get(`https:${config.domain}/napi/site/createHtml/category?token=EFE4F3EC3F788CE7`);
//   console.log('======updateCategoryCacheBySchedule====');
// });

// schedule.scheduleJob('0 0 * * * *', function () {
//   newsCore.getAllTopNews(false);
//   setTimeout(() => {
//     updateIndexCache();
//     console.log('======updateCacheBySchedule====');
//   }, 5000);
// });
