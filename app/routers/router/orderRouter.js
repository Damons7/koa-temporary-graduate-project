/*
 * @Description: 订单模块路由
 * @Author: 李鸿智
 */
const Router = require('koa-router');
const orderController = require('../../controllers/orderController')
const passport = require('koa-passport')
const orderRouter = new Router();

orderRouter
  .post('/users/order/getOrder',passport.authenticate('jwt', { session: false }), orderController.GetOrder)
  .post('/users/order/addOrder', passport.authenticate('jwt', { session: false }),orderController.AddOrder)
  .post('/users/order/orderDetails',passport.authenticate('jwt', { session: false }), orderController.OrderDetails)
module.exports = orderRouter;