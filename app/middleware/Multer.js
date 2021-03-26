const multer = require('koa-multer')//解析上传文件
const path = require('path')
const fs = require('fs');

//用户头像存储
const userStorage = multer.diskStorage({
    //定义文件保存路径
    destination: path.resolve('public/imgs/userAvatar'),
    //修改文件名
    filename: function (ctx, file, cb) {
        const fileFormat = (file.originalname).split(".");
        cb(null, fileFormat[0] + "." + fileFormat[fileFormat.length - 1]);
    }
});

//商品图片详情存储
const obj = {
    //定义文件保存路径
    destination: function (ctx, file, cb) {
        const fileArr =file.originalname.split('_');
        const config = {
            '书籍':'book',
            '电子设备':'appliance2',
            '娱乐':"amusement",
            '其他宝藏':'accessory'
        }
        //创建文件名
        const fsName= `public/imgs/${config[fileArr[0]]}/${fileArr[1]}`;
        fs.mkdirSync(fsName, {
            recursive: true  //是否递归
        }, (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
        cb(null, path.resolve(fsName))
      },

    //修改文件名
    filename: function (ctx, file, cb) {
        const fileFormat = (file.originalname).split(".");
        const fileName = fileFormat[0].split('_')
        cb(null, fileName[1] + fileName[2]+ "." + fileFormat[fileFormat.length - 1]);
    }
}
obj.filename = obj.filename.bind(obj)
const productsStorage = multer.diskStorage(obj);

const userUpload = multer({ storage: userStorage });
const productsUpload = multer({ storage: productsStorage });
module.exports = {
    userUpload,
    productsUpload
}