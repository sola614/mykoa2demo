const router = new require('koa-router')();
const public = require("./controllers/public");
let nav = require('../mock/nav');

router.get('/apis/orderList', async function (ctx, next) {
  ctx.body = nav;
});
router.post('/apis/category', async function (ctx, next) {
  console.log(typeof ctx.request.body);
  let friendsLinksRes = {};
  if (ctx.request.body.a == 2) {
    friendsLinksRes = await public.request([{
      url: "http://192.168.1.133/website/api/home/getSiteDataBySiteData",
      senData: {
        dataType: 90
      }
    }], ctx);
  } else {
    friendsLinksRes = {
      code: 400,
      data: null,
      message: '参数不能为空!'
    }
  }

  ctx.status = 200;
  ctx.body = friendsLinksRes[0] ? friendsLinksRes[0] : friendsLinksRes;
  // ctx.body=category
});
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
router.post('/apis/upload', async function (ctx, next) {

  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../files'); //设置文件接收后保存的文件夹。此文件夹一般为上传后的临时文件夹，上传后调用 fs.rename()对文件进行移动及重命名。默认保存路径为os.tmpDir()
  form.keepExtensions = true; //使用文件的原扩展名
  // form.type//'multipart'或'urlencoded'类型的请求在formidable都支持，可通过上传文件的type属性查看文件类型
  // form.maxFieldsSize = 2 * 1024 * 1024;//设置上传文件的大小，默认值为2M
  // form.maxFields = 1000;//设置最大可接收字段数，用于防止内存溢出，默认值为1000
  // form.hash = false;//是否对上传文件进行hash较验，可设置为'sha1' 或 'md5'

  let filesUrl = [];
  await _fileParse();
  ctx.status = 200;
  ctx.body = {
    code: 0,
    data: {
      filesUrl
    }
  };
  // 文件解析与保存
  async function _fileParse() {
    form.parse(ctx.req, (err, fields, files) => {
      if (err) throw err;
      var errCount = 0;
      var keys = Object.keys(files);
      //文件移动的目录文件夹，不存在时创建目标文件夹
      var targetDir = path.join(__dirname, '../upload');
      if (!fs.existsSync(targetDir)) {
        fs.mkdir(targetDir);
      }
      keys.forEach(function (key) {
        var filePath = files[key].path;
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
          errCount += 1;
        } else {
          //以当前时间戳对上传文件进行重命名
          var fileName = new Date().getTime() + fileExt;
          var targetFile = path.join(targetDir, fileName);
          //移动文件
          fs.renameSync(filePath, targetFile); //跨盘移动会报错，如果没设置form.uploadDir需用下面方法
          // var is = fs.createReadStream(filePath);
          // var os = fs.createWriteStream(targetFile);
          // is.pipe(os);
          // is.on('end', function () {
          //   fs.unlinkSync(filePath);
          // });
          // 文件的Url（相对路径）
          filesUrl.push('/upload/' + fileName);
        }
      });
    });
  }

});
server.use(router.routes());
