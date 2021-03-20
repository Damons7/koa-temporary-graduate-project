/*
 * @Description: 我的收藏模块控制器
 * @Author: 李鸿智
 */
const collectDao = require('../dao/collectDao');
const productDao = require('../dao/productDao');

module.exports = {
  /**
   * 添加收藏
   * @param {Object} ctx
   */
  AddCollect: async ctx => {
    const { user_id, product_id } = ctx.request.body;

    // 判断该用户的收藏列表是否存在该商品
    const tempCollect = await collectDao.FindCollect(user_id, product_id);

    if (tempCollect.length > 0) {
      ctx.body = {
        code: '003',
        msg: '该商品已经添加收藏，请到我的收藏查看'
      }
      return;
    }

    try {
      // 把收藏商品信息插入数据库
      const result = await collectDao.AddCollect(user_id, product_id);
      // 插入成功
      if (result.length === 1) {
        ctx.body = {
          code: '001',
          msg: '添加收藏成功'
        }
        return;
      }
    } catch (error) {
      console.log(error);
      return ;
    }

    ctx.body = {
      code: '002',
      msg: '添加收藏失败'
    }
  },
  /**
   * 获取用户的所有收藏商品信息
   * @param {Object} ctx
   */
  GetCollect: async ctx => {
    const { user_id } = ctx.request.body;

    // 获取所有收藏信息
    const collect = await collectDao.GetCollect(user_id);

    // 该用户没有收藏的商品,直接返回信息
    if (collect.length == 0) {
      ctx.body = {
        code: '002',
        msg: '该用户没有收藏的商品'
      }
      return;
    }

    let collectList = [];
    // 生成收藏商品的详细信息列表
    for (let i = 0; i < collect.length; i++) {
      const temp = collect[i];
      // 获取每个商品详细信息
      const product = await productDao.GetProductByProductId(temp.product_id);
      collectList.push(product[0]);
    }

    ctx.body = {
      code: '001',
      collectList: collectList
    }
  },
  /**
   * 删除用户的收藏商品信息
   * @param {Object} ctx
   */
  DeleteCollect: async ctx => {
    const { user_id, product_id } = ctx.request.body;

    // 判断该用户的收藏列表是否存在该商品
    const tempCollect = await collectDao.FindCollect(user_id, product_id);
    if (tempCollect.length > 0) {
      // 如果存在则删除
      try {
        const result = await collectDao.DeleteCollect(user_id, product_id);
        // 判断是否删除成功
        if (result.ok === 1) {
          ctx.body = {
            code: '001',
            msg: '删除收藏成功'
          }
          return;
        }
      } catch (error) {
        console.log(error);
        return ;
      }
    } else {
      // 不存在则返回信息
      ctx.body = {
        code: '002',
        msg: '该商品不在收藏列表'
      }
    }
  }
}