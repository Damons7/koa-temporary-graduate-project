const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productPictureSchema = new Schema({
    //图片id
    product_id: {
        type: Number,
    },
    //商品照片
    product_picture: {
        type: String,
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

module.exports = ProductPicture = mongoose.model("productpictures", productPictureSchema);

