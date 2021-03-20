const koa = require('koa');
const router = require('./app/routers');
const dbConnect = require('./mongodb/db');
const bodyParser = require('koa-bodyparser');
const KoaStatic = require('koa-static');
const passport = require('koa-passport')//passport引入   （验证邮箱密码工具）
const { Port, staticDir } = require('./config');
const app = new koa();

app.use(bodyParser());

//初始化passport
app.use(passport.initialize())
app.use(passport.session())

// 为静态资源请求重写url
const rewriteUrl = require('./app/middleware/rewriteUrl');
app.use(rewriteUrl);
// 使用koa-static处理静态资源
app.use(KoaStatic(staticDir));

//回调到config.js文件中  passport.js
require('./app/tools/token/passport.js')(passport);

//启动数据库
dbConnect();

//使用路由中间件
app.use(router.routes()).use(router.allowedMethods())

//开启服务器
app.listen(Port, () => {
    console.log(`serve started on ${Port}`);
})







