const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectSchema = new Schema({
    //	用户id
    user_id: {
        type: String,
        required: true,
    },
    //	商品id
    product_id: {
        type: String,
        required: true,
        // default: generateUUID(),
        unique: true
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

module.exports = Collect = mongoose.model("collects", collectSchema);