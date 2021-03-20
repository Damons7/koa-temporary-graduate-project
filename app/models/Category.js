const mongoose = require('mongoose');
const generateUUID = require('../tools/getUUID');
const Schema =mongoose.Schema;

const categorySchema =new Schema({
    //商品分类id
    category_id:{
        type:String,
        required:true,
        default:generateUUID(),
        unique :true
    },
     //商品分类名
     category_name:{
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

module.exports =Category =mongoose.model("categories",categorySchema);