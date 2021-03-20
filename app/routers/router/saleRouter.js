/*
 * @Description: 上架商品模块路由
 * @Author: 李鸿智
 */
const Router = require('koa-router');
const passport = require('koa-passport')
const saleController = require('../../controllers/saleController')
const productRouter = new Router();

productRouter
  .post('/sale/delivery',passport.authenticate('jwt', { session: false }), saleController.Delivery)
  .post('/sale/getDelivery',passport.authenticate('jwt', { session: false }), saleController.GetDelivery)
module.exports = productRouter;