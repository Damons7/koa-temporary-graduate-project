const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    //订单id
    order_id: {
        type: String,
        required: true,
    },
    //订单状态
    order_state: {
        type: String,
        default: "待发货"
    },
    //	用户id
    user_id: {
        type: String,
        required: true,
    },
    //用户地址信息
    address: {
        type: Object
    },
    //	商品id
    product_id: {
        type: Number,
        required: true,
    },
    //商品名称
    product_name: {
        type: String,
        required: true,
    },
    //商品数量
    product_num: {
        type: Number,
        default: 0
    },
    //商品图片
    product_img: {
        type: String,
    },
    //商品价格
    product_price: {
        type: Number,
    },
    //上架商家
    from_user: {
        type: String,
        required: true,
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

module.exports = Orders = mongoose.model("orders", ordersSchema);

