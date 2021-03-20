/*
 * @Description: 购物车模块路由
 * @Author: 李鸿智
 */
const Router = require('koa-router');
const shoppingCartController = require('../../controllers/shoppingCartController')
const passport = require('koa-passport')

let shoppingCartRouter = new Router();

shoppingCartRouter
  .post('/users/shoppingCart/getShoppingCart',passport.authenticate('jwt',{session:false}), shoppingCartController.GetShoppingCart)
  .post('/users/shoppingCart/addShoppingCart',passport.authenticate('jwt',{session:false}), shoppingCartController.AddShoppingCart)
  .post('/users/shoppingCart/deleteShoppingCart',passport.authenticate('jwt',{session:false}), shoppingCartController.DeleteShoppingCart)
  .post('/users/shoppingCart/updateShoppingCart',passport.authenticate('jwt',{session:false}), shoppingCartController.UpdateShoppingCart)

module.exports = shoppingCartRouter;