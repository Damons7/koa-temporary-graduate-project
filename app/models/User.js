const mongoose = require('mongoose');
const generateUUID = require('../tools/getUUID');
const Schema =mongoose.Schema;

const userSchema =new Schema({
    //邮箱
    uuid:{
        type:String,
        required:true,
        default:generateUUID(),
        unique :true
    },
    email:{
        type:String,
        required:true,
        unique :true
    },
    //密码
    password:{
        type:String,
        required:true
    },
    //姓名
    name:{
        type:String,
    },
    //性别
    gender:{
        type:String,
        default:'男'
    },
    //年龄
    age:{
        type:Number,
        default:0
    },
    //头像
    avatar:{
        type:String,
    },
    //创建日期
    date:{
        type:Date,
        default:Date.now
    },
    //更新日期
    updateDate:{
        type:Date,
        default:Date.now
    },

})

module.exports =User =mongoose.model("users",userSchema);

