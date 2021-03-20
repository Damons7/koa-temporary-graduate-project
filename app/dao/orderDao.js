/*
 * @Description: 订单模块数据持久层
 * @Author: 李鸿智
 */
const Orders = require('../models/Orders');

module.exports = {

  // 连接数据库获取所有的订单详细信息
  GetOrder: async user_id => {
    return await Orders.find({ user_id: user_id }).sort({ updateDate: -1 });
  },
  // 连接数据库插入订单信息
  AddOrder: async data => {
    return await Orders.insertMany(data);
  },
  // 发货，更新订单信息，状态更改
  updateOrdersByDelivery: async (order_id, product_id, from_user) => {
    return await Orders.updateOne({ $and: [{ order_id: order_id }, { product_id: product_id }, { from_user: from_user }] },
      { $set: { order_state: "发货中" } });
  },
  // 根据上架人查询订单
  getOrdersByDelivery: async from_user => {
    return await Orders.find({ from_user: from_user });
  },
  // 根据上架人及订单状态查询订单详情
  getOrdersByDeliveryState: async (from_user, order_state) => {
    return await Orders.find({ $and: [{ from_user: from_user }, { order_state: order_state }] });
  }
}