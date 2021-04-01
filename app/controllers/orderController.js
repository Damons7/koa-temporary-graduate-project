/*
 * @Description: 订单模块控制器
 * @Author:李鸿智
 */
const orderDao = require('../dao/orderDao');
const shoppingCartDao = require('../dao/shoppingCartDao');
const productDao = require('../dao/productDao');

module.exports = {
  /**
   * 获取用户的所有订单信息
   * @param {Object} ctx
   */
  GetOrder: async ctx => {
    const { user_id } = ctx.request.body;

    // 获取所有的订单详细信息
    const orders = await orderDao.GetOrder(user_id);
    // 该用户没有订单,直接返回信息
    if (orders.length == 0) {
      ctx.body = {
        code: '002',
        msg: '该用户没有订单信息'
      }
      return;
    }
    let ordersList = [];
    const len = orders.length;
    for (let j = 0; j < len; j++) {
      let tempOrder = [];
      let order = {
        product_num: orders[j].product_num,
        _id: orders[j]._id,
        order_id: orders[j].order_id,
        order_state: orders[j].order_state,
        user_id: orders[j].user_id,
        product_id: orders[j].product_id,
        product_price: orders[j].product_price,
        from_user: orders[j].from_user,
        date: orders[j].date,
        updateDate: orders[j].updateDate,
      };
      // 获取每个商品详细信息
      const product = await productDao.GetProductByProductId_order(order.product_id);
      order.product_name = product[0].product_name;
      order.product_picture = product[0].product_picture;
      const index = ordersList.findIndex(item => item[0].order_id === orders[j].order_id)
      if (~index) {
        ordersList[index].push(order)
      } else {
        tempOrder.push(order);
        ordersList.push(tempOrder);
      }
    }

    ctx.body = {
      code: '001',
      orders: ordersList
    }

  },
  /**
   * 添加用户订单信息
   * @param {Object} ctx
   */
  AddOrder: async (ctx) => {
    const { user_id, products, address } = ctx.request.body;
    // 获取当前时间戳
    const timeTemp = new Date().getTime();
    // 生成订单id：用户id+时间戳(string)
    const orderID = `${user_id}${timeTemp}`;

    let data = [];
    const len = products.length;
    for (let i = 0; i < len; i++) {
      const hasProduct = await productDao.GetProductByProductId_order(products[i].productID);
      if (hasProduct[0].product_num - hasProduct[0].product_sales === 0) {
        ctx.body = {
          code: '003',
          msg: '购物车商品库存不足！'
        }
        return
      }
      const isSales = await productDao.UpdateProductSales(products[i].productID);
      //更新商品销量
      if (isSales.ok === 1) {
        //商品销量达到商品数量，自动下架商品
        if (hasProduct[0].product_num - hasProduct[0].product_sales - 1 === 0) {
          await productDao.UpdateProductState(products[i].productID);
        }
      }
      const product =
      {
        order_id: orderID,
        user_id: user_id,
        product_id: products[i].productID,
        product_num: products[i].num,
        product_name: products[i].productName,
        product_img: products[i].productImg,
        product_price: products[i].price,
        from_user: products[i].from_user,
        address: address
      };
      data.push(product)
    }
    try {
      // 把订单信息插入数据库
      const result = await orderDao.AddOrder(data);
      // 插入成功
      if (result.length == products.length) {
        //删除购物车
        let rows = 0;
        for (let i = 0; i < products.length; i++) {
          const res = await shoppingCartDao.DeleteShoppingCart(user_id, products[i].productID);
          rows += res.ok;
        }

        //判断删除购物车是否成功
        if (rows != products.length) {
          ctx.body = {
            code: '002',
            msg: '购买成功,但购物车没有更新成功'
          }
          return;
        }

        ctx.body = {
          code: '001',
          msg: '购买成功'
        }
      } else {
        ctx.body = {
          code: '004',
          msg: '购买失败,未知原因'
        }
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },

  /**
 * 订单详细信息
 * @param {Object} ctx
 */
  OrderDetails: async (ctx) => {
    const { from_user, order_state } = ctx.request.body;
    const result = await orderDao.getOrdersByDeliveryState(from_user, order_state);
    let ordersList = [], obj = {}
    result.forEach(item => {
      const id = item.order_id
      obj[id] ? obj[item.order_id].push(item) : (obj[id] = [item])
    })
    Object.keys(obj).forEach(item => {
      ordersList.push(obj[item])
    })
    if (result.length === 0) {
      ctx.body = {
        code: '002',
        msg: '未找到订单详情数据'
      }
      return;
    }
    ctx.body = {
      code: '001',
      msg: 'success',
      orders: ordersList
    }

  },

  /**
 * 确认收货
 * @param {Object} ctx
 */
  OnOKOrder: async (ctx) => {
    const { order_id, product_id, from_user } = ctx.request.body;
    const updateResult = await orderDao.onOKUpdateOrders(order_id, product_id, from_user);

    if (updateResult.ok === 1) {
      ctx.body = {
        code: '001',
        msg: '已确认收货'
      }
      return;
    }
    ctx.body = {
      code: '002',
      msg: '确认收货失败'
    }
  },

  /**
* 确认退货
* @param {Object} ctx
*/
  ReturnOrder: async (ctx) => {
    const { order_id, product_id, from_user } = ctx.request.body;
    const updateResult = await orderDao.returnUpdateOrders(order_id, product_id, from_user);

    if (updateResult.ok === 1) {
      ctx.body = {
        code: '001',
        msg: '退货成功'
      }
      return;
    }
    ctx.body = {
      code: '002',
      msg: '退货失败'
    }
  }
}
