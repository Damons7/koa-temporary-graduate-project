/*
 * @Description: 购物车模块控制器
 * @Author: 李鸿智
 */

const orderDao = require('../dao/orderDao');

module.exports = {
    /**
     * 订单发货
     * @param {Object} ctx
     */
    Delivery: async ctx => {
        const { order_id, product_id, from_user } = ctx.request.body;
        const updateResult = await orderDao.updateOrdersByDelivery(order_id, product_id, from_user);

        if (updateResult.ok === 1) {
            ctx.body = {
                code: '001',
                msg: '商品发货成功'
            }
            return;
        }
        ctx.body = {
            code: '002',
            msg: '商品发货失败'
        }

    },

    /**
     * 查询上架订单
     * @param {Object} ctx
     */
    GetDelivery: async ctx => {
        const { from_user } = ctx.request.body;
        const result = await orderDao.getOrdersByDelivery(from_user);

        if (result.length === 0) {
            ctx.body = {
                code: '002',
                msg: '暂无待发货'
            }
            return;
        }
        let ordersList = [], obj = {}
        result.forEach(item => {
            const id = item.order_id
            obj[id] ? obj[item.order_id].push(item) : (obj[id] = [item])
        })
        Object.keys(obj).forEach(item => {
            ordersList.push(obj[item])
        })
        ctx.body = {
            code: '001',
            msg: 'success',
            orders: ordersList
        }

    }
}