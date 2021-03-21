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

    for (let j = 0; j < orders.length; j++) {
      let tempOrder = [];
      let order = {
        product_num: orders[j].product_num,
        _id: orders[j]._id,
        order_id: orders[j].order_id,
        order_state: orders[j].order_state,
        user_id: orders[j].user_id,
        product_id: orders[j].product_id,
        product_price: orders[j].product_price,
        date: orders[j].date,
        updateDate: orders[j].updateDate
      };
      // 获取每个商品详细信息
      const product = await productDao.GetProductByProductId(order.product_id);
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
    // 根据数据库表结构生成字段信息
    products.forEach(item => {

      const product =
      {
        order_id: orderID,
        user_id: user_id,
        product_id: item.productID,
        product_num: item.num,
        product_name: item.productName,
        product_img: item.productImg,
        product_price: item.price,
        from_user: item.from_user,
        address: address
      };
      data.push(product)
    })

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

  }
}