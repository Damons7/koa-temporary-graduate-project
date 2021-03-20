const multer = require('koa-multer')//解析上传文件
const path = require('path')

const userStorage = multer.diskStorage({
    //定义文件保存路径
    destination: path.resolve('public/imgs/userAvatar'),
    //修改文件名
    filename: function (ctx, file, cb) {
        console.log('查看', file);
        
        var fileFormat = (file.originalname).split(".");
        cb(null, fileFormat[0] + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

const productsStorage = multer.diskStorage({
    //定义文件保存路径
    destination: path.resolve('public/imgs/upload'),
    //修改文件名
    filename: function (ctx, file, cb) {
        const { user_id } = ctx.req.body;
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

const userUpload = multer({ storage: userStorage });
const productsUpload = multer({ storage: productsStorage });
module.exports = {
    userUpload,
    productsUpload
}