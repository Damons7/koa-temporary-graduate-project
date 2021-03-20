/*
 * @Description: 全局配置信息
 * @Author: 李鸿智
 */
const path = require('path');

module.exports = {
  Port: 6008, // 启动端口
  staticDir: path.resolve('./public'), // 静态资源路径
  uploadDir: path.join(__dirname, path.resolve('public/')), // 上传文件路径
}