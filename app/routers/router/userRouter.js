/*
 * @Description: 用户模块路由
 * @Author: 李鸿智
 */
const Router = require('koa-router');
const userController = require('../../controllers/userController')
const passport = require('koa-passport')//passport引入   （验证邮箱密码工具）
const userRouter = new Router();
const {userUpload} = require('../../middleware/Multer');
userRouter
  .post('/users/login', userController.Login)
  .post('/users/register', userController.Register)
  .post('/users/getAddress', passport.authenticate('jwt', { session: false }), userController.GetAddress)
  .post('/users/addAddress', passport.authenticate('jwt', { session: false }), userController.AddAddress)
  .post('/users/delAddress', passport.authenticate('jwt', { session: false }), userController.DelAddress)
  .post('/users/updateAddress', passport.authenticate('jwt', { session: false }), userController.UpdateAddress)
  .post('/users/getUserData', passport.authenticate('jwt', { session: false }), userController.GetUserData)
  .post('/users/updateUserData', passport.authenticate('jwt', { session: false }), userController.UpdateUserData)
  .post('/users/updateUserPassword', passport.authenticate('jwt', { session: false }), userController.UpdateUserPassword)
  .post('/users/uploadAvatar', passport.authenticate('jwt', { session: false }), userUpload.single('file'), userController.UploadAvatar)
module.exports = userRouter;