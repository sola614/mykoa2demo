var env = process.env.NODE_ENV || "dev";
var site = {
  title: "",
  keyword: "",
  description: ""
};
// redis配置
let rds = {
  host: "192.168.1.133",
  port: 6379,
  db: 2,
  ttl: 30 * 60 * 60 * 1000,
  password: "local-fuck-888"
};
let envPath = "/dev/";
let sitePath = "";
let domain = "";
let apiPath = "";
let staticPath = "";
if (process.browser) {
  apiPath = "http://" + location.host;
}

if (env == "uat") {
  staticPath = "//test.allchips.com/static/site";
}
if (env == "sit") {
  staticPath = "//sit.allchips.com/static/site";
}
if (env == "production") {
  staticPath = "//www.allchips.com/static/site";
}

module.exports = {
  port: 8088,
  rds,
  env,
  apiPath,
  staticPath
};
