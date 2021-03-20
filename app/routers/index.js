/*
 * @Description: 汇总模块子路由
 * @Author: 李鸿智
 */
const Router = require('koa-router');

const Routers = new Router();

const userRouter = require('./router/userRouter'),
        orderRouter = require('./router/orderRouter'),
        productRouter = require('./router/productRouter'),
        saleRouter = require('./router/saleRouter'),
// const resourcesRouter = require('./router/resourcesRouter');
 shoppingCartRouter = require('./router/shoppingCartRouter'),
 collectRouter = require('./router/collectRouter');

Routers.use(userRouter.routes());
Routers.use(orderRouter.routes());
// Routers.use(resourcesRouter.routes());
Routers.use(productRouter.routes());
Routers.use(shoppingCartRouter.routes());
Routers.use(orderRouter.routes());
Routers.use(collectRouter.routes());
Routers.use(saleRouter.routes());

module.exports = Routers;