/*
 * @Description: 商品模块数据持久层
 * @Author: 李鸿智
 */

const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductPicture = require('../models/ProductPicture');
module.exports = {
  GetCategory: async () => {
    return await Category.find({});
  },
  GetCategoryByName: async categoryName => {
    return await Category.find({ category_name: categoryName });
  },
  
  //根据商品类型id查询商品数据（限制7条）
  GetPromoProductById: async categoryID => {
    return await Product.find({ category_id: categoryID }).limit(7);
  },
  //根据商品id查询商品数据
  GetProductByProductId: async id => {
    return await Product.find({ product_id: id }); 
  },
  // 连接数据库,根据商品id,获取商品图片
  GetDetailsPicture: async productID => {
    return await ProductPicture.find({ product_id: productID })
  },
  // 分页获取所有的商品信息
  GetAllProduct: async (offset = 0, rows = 0) => {
    return await Product.find({}).skip(offset).limit(rows);
  },
  // 根据商品分类id,分页获取商品信息
  GetProductByCategory: async (categoryID, offset = 0, rows = 0) => {
    return await Product.find({ category_id: categoryID[0] })
      .sort({ product_selling_price: 1 }).skip(offset).limit(rows);
  },
  //根据搜索条件,分页获取商品信息
  GetProductBySearch: async (search, offset = 0, rows = 0) => {
    const _search = new RegExp(`${search}`,"i")
    return await Product.find({ $or: [{ product_name: _search }, { product_title: _search }, { product_intro: _search }] })
      .sort({ product_selling_price: 1 }).skip(offset).limit(rows);
  },

}
