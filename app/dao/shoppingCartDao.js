/*
 * @Description: 购物车模块数据持久层
 * @Author: 李鸿智
 */

const ShoppingCart = require('../models/ShoppingCart');
// shoppingCart
module.exports = {
  // 获取购物车信息
  GetShoppingCart: async user_id => {
    return await ShoppingCart.find({ user_id: user_id }).sort({ updateDate: -1 });
  },
  // 查询用户的购物车的某个商品
  FindShoppingCart: async (user_id, product_id) => {
    return await ShoppingCart.find({ $and: [{ user_id: user_id }, { product_id: product_id }] });
  },
  //更新购物车商品数量
  UpdateShoppingCart: async (NewNum, user_id, product_id) => {
    return await ShoppingCart.updateOne({ $and: [{ user_id: user_id }, { product_id: product_id }] }, { $set: { product_num: NewNum } });
  },
  // // 新插入购物车信息
  AddShoppingCart: async (user_id, product_id,from_user) => {
    return await ShoppingCart.insertMany([{
      user_id: user_id,
      product_id: product_id,
      product_num: 1,
      from_user:from_user
    }]);
  },
  // // 删除购物车信息
  DeleteShoppingCart: async (user_id, product_id) => {
    return await ShoppingCart.deleteOne({ $and: [{ user_id: user_id }, { product_id: product_id }] });
  }
}