/*
 * @Description: 我的收藏模块路由
 * @Author: 李鸿智
 */
const Router = require('koa-router');
const collectController = require('../../controllers/collectController')
const passport = require('koa-passport')
const collectRouter = new Router();

collectRouter
  .post('/users/collect/addCollect', passport.authenticate('jwt', { session: false }), collectController.AddCollect)
  .post('/users/collect/getCollect', passport.authenticate('jwt', { session: false }), collectController.GetCollect)
  .post('/users/collect/deleteCollect', passport.authenticate('jwt', { session: false }), collectController.DeleteCollect)

module.exports = collectRouter; 