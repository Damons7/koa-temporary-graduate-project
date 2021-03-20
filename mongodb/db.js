const dbConfig = require('./config/dbConfig')   //引入数据库配置
const mongoose = require('mongoose');           //引入mongoose

module.exports = () => {
    //连接数据库
    mongoose.connect(
        `${dbConfig.dbUrl}${dbConfig.dbName}`,
        { useUnifiedTopology: true, useNewUrlParser: true },
    ).then(() => {
        console.log('mongodb connect success...');
    }).catch(err => {
        console.log(err, 'mongodb connect fail...');
    })
}
