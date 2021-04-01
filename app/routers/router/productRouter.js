/*
 * @Description: 用户模块路由
 * @Author: 李鸿智
 */
const Router = require('koa-router');
const productController = require('../../controllers/productController')
const passport = require('koa-passport')//passport引入   （验证邮箱密码工具）
const productRouter = new Router();
const { productsUpload } = require('../../middleware/Multer');

productRouter
  .post('/product/getPromoProduct', productController.GetPromoProduct)
  .post('/product/getDetails', productController.GetDetails)
  .post('/product/getDetailsPicture', productController.GetDetailsPicture)
  .post('/product/getAllProduct', productController.GetAllProduct)
  .post('/product/getCategory', productController.GetCategory)
  .post('/product/getProductByCategory', productController.GetProductByCategory)
  .post('/product/getProductBySearch', productController.GetProductBySearch)
  .post('/product/getAddProduct', passport.authenticate('jwt', { session: false }), productController.GetAddProduct)
  .post('/product/addProduct', passport.authenticate('jwt', { session: false }),
    productsUpload.array('file', 5), productController.AddProduct)
  .post('/product/updateProduct', passport.authenticate('jwt', { session: false }),
    productsUpload.array('file', 5), productController.UpdateProduct)
    .post('/product/returnProduct', passport.authenticate('jwt', { session: false }), productController.ReturnProduct)
module.exports = productRouter;