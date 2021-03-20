/*
 * @Description: 重写静态资源URL
 * @Author: 李鸿智
 */
module.exports = async (ctx, next) => {
  if (ctx.url.startsWith('/public')) {
    ctx.url = ctx.url.replace('/public', '');
  }
  await next();
}