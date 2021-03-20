const mongoose = require('mongoose');
const generateUUID = require('../tools/getUUID');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    //	商品类型
    category_id: {
        type: Number,
        required: true,
    },
    //	商品id
    product_id: {
        type: Number,
        required: true,
        // default: generateUUID(),
        unique: true
    },
    //商品详细介绍
    product_intro: {
        type: String,
    },
    //商品名称
    product_name: {
        type: String,
        required: true
    },
    //商品数量
    product_num: {
        type: Number,
        default: 0
    },
    //商品照片
    product_picture: {
        type: String,
    },
    //商品原价
    product_price: {
        type: Number,
    },
    //商品折后价
    product_selling_price: {
        type: Number,
    },
    product_title: {
        type: String,
    },
    //商品卖出数量
    product_sales: {
        type: Number,
    },
    //创建日期
    date: {
        type: Date,
        default: Date.now
    },
    //更新日期
    updateDate: {
        type: Date,
        default: Date.now
    },

})

module.exports = Product = mongoose.model("products", productSchema);