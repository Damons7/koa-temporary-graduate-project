/*
 * @Description: 用户模块路由
 * @Author: 李鸿智
 */
const Router = require('koa-router');
const productController = require('../../controllers/productController')

const productRouter = new Router();

productRouter
  .post('/product/getPromoProduct', productController.GetPromoProduct)
  .post('/product/getDetails', productController.GetDetails)
  .post('/product/getDetailsPicture', productController.GetDetailsPicture)
  .post('/product/getAllProduct', productController.GetAllProduct)
  .post('/product/getCategory', productController.GetCategory)
  .post('/product/getProductByCategory', productController.GetProductByCategory)
  .post('/product/getProductBySearch', productController.GetProductBySearch)
module.exports = productRouter;