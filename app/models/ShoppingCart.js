const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shoppingCartSchema = new Schema({
    //	商品id
    product_id: {
        type: String,
        required: true
    },
    //用户
    user_id: {
        type: String,
        required: true
    },
    from_user:{
        type: String,
        required: true  
    },
    //商品数量
    product_num: {
        type: Number,
        required: true
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

module.exports = ShoppingCart = mongoose.model("shoppingcarts", shoppingCartSchema);