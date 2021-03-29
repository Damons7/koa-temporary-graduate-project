/*
 * @Description: 购物车模块控制器
 * @Author: 李鸿智
 */
const shoppingCartDao = require('../dao/shoppingCartDao');
const productDao = require('../dao/productDao');

let methods = {
  /**
   * 生成购物车详细信息
   * @param {Object} data
   */
  ShoppingCartData: async data => {
    let shoppingCartData = [];
    for (let i = 0; i < data.length; i++) {
      const temp = data[i];
      const product = await productDao.GetProductByProductId(temp.product_id);

      const shoppingCartDataTemp = {
        id: temp.id,
        productID: temp.product_id,
        productName: product[0].product_name,
        productImg: product[0].product_picture,
        price: product[0].product_price,
        selling_price: product[0].product_selling_price,
        num: temp.product_num,
        from_user: temp.from_user,
        maxNum: Math.floor(product[0].product_num / 2),
        check: false
      };

      shoppingCartData.push(shoppingCartDataTemp);
    }
    return shoppingCartData;
  }
}

module.exports = {
  /**
   * 获取购物车信息
   * @param {Object} ctx
   */
  GetShoppingCart: async ctx => {
    let { user_id } = ctx.request.body;

    // 获取购物车信息
    const shoppingCart = await shoppingCartDao.GetShoppingCart(user_id);
    // 生成购物车详细信息
    const data = await methods.ShoppingCartData(shoppingCart);
    ctx.body = {
      code: '001',
      shoppingCartData: data
    }
  },
  /**
   * 插入购物车信息
   * @param {Object} ctx
   */
  AddShoppingCart: async ctx => {
    const { user_id, product_id, from_user } = ctx.request.body;
    //判断商品是否还有
    const hasProduct = await productDao.GetProductByProductId(product_id);
    if (hasProduct.length < 1 || hasProduct[0].product_num - hasProduct[0].product_sales === 0) {
      ctx.body = {
        code: '004',
        msg: '商品库存不足！'
      }
      return
    }
    const tempShoppingCart = await shoppingCartDao.FindShoppingCart(user_id, product_id);
    //判断该用户的购物车是否存在该商品
    if (tempShoppingCart.length > 0) {
      //如果存在则把数量+1
      const tempNum = tempShoppingCart[0].product_num + 1;
      const maxNum = Math.floor((hasProduct[0].product_num - hasProduct[0].product_sales) / 2);
      //判断数量是否达到限购数量
      if (tempNum > maxNum) {
        ctx.body = {
          code: '003',
          msg: '数量达到限购数量 ' + tempShoppingCart[0].product_num
        }
        return;
      }

      try {
        // 更新购物车信息,把数量+1
        const result = await shoppingCartDao.UpdateShoppingCart(tempNum, user_id, product_id);
        if (result.ok === 1) {
          ctx.body = {
            code: '002',
            msg: '该商品已在购物车，数量 +1'
          }
          return;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      //不存在则添加
      try {
        // 新插入购物车信息
        const res = await shoppingCartDao.AddShoppingCart(user_id, product_id, from_user);

        // 判断是否插入成功
        if (res.length === 1) {
          // 如果成功,获取该商品的购物车信息
          const shoppingCart = await shoppingCartDao.FindShoppingCart(user_id, product_id);
          // 生成购物车详细信息
          const data = await methods.ShoppingCartData(shoppingCart);

          ctx.body = {
            code: '001',
            msg: '添加购物车成功',
            shoppingCartData: data
          }
          return;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }

    ctx.body = {
      code: '005',
      msg: '添加购物车失败,未知错误'
    }
  },
  /**
   * 删除购物车信息
   * @param {Object} ctx
   */
  DeleteShoppingCart: async ctx => {
    const { user_id, product_id } = ctx.request.body;

    // 判断该用户的购物车是否存在该商品
    const tempShoppingCart = await shoppingCartDao.FindShoppingCart(user_id, product_id);

    if (tempShoppingCart.length > 0) {
      // 如果存在则删除
      try {
        const result = await shoppingCartDao.DeleteShoppingCart(user_id, product_id);

        // 判断是否删除成功
        if (result.deletedCount === 1) {
          ctx.body = {
            code: '001',
            msg: '删除购物车成功'
          }
          return;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      // 不存在则返回信息
      ctx.body = {
        code: '002',
        msg: '该商品不在购物车'
      }
    }
  },
  /**
   * 更新购物车商品数量
   * @param {Object} ctx
   */
  UpdateShoppingCart: async ctx => {
    let { user_id, product_id, num } = ctx.request.body;

    // 判断数量是否小于1
    if (num < 1) {
      ctx.body = {
        code: '004',
        msg: '数量不合法'
      }
      return;
    }
    // 判断该用户的购物车是否存在该商品
    let tempShoppingCart = await shoppingCartDao.FindShoppingCart(user_id, product_id);
    if (tempShoppingCart.length > 0) {
      // 如果存在则修改

      // 判断数量是否有变化
      if (tempShoppingCart[0].product_num == num) {
        ctx.body = {
          code: '003',
          msg: '数量没有发生变化'
        }
        return;
      }
      const product = await productDao.GetProductByProductId(product_id);

      const maxNum = Math.floor(product[0].product_num / 2);
      // 判断数量是否达到限购数量
      if (num > maxNum) {
        ctx.body = {
          code: '004',
          msg: '数量达到限购数量 ' + maxNum
        }
        return;
      }

      try {
        // 修改购物车信息
        const result = await shoppingCartDao.UpdateShoppingCart(num, user_id, product_id)
        // 判断是否修改成功
        if (result.ok === 1) {
          ctx.body = {
            code: '001',
            msg: '修改购物车数量成功'
          }
          return;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      //不存在则返回信息
      ctx.body = {
        code: '002',
        msg: '该商品不在购物车'
      }
    }
  }
}