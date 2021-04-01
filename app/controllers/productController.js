/*
 * @Description: 商品模块控制器
 * @Author: 李鸿智
 */
const productDao = require('../dao/productDao');
const generateUUID = require('../tools/getUUID')
module.exports = {
  /**
   * 获取商品分类
   * @param {Object} ctx
   */
  GetCategory: async ctx => {
    const category = await productDao.GetCategory();
    ctx.body = {
      code: '001',
      category
    }
  },

  /**
   * 根据商品分类名称获取首页展示的商品信息
   * @param {Object} ctx
   */
  GetPromoProduct: async ctx => {
    const { categoryName } = ctx.request.body;
    // 根据商品分类名称获取分类id
    const category = await productDao.GetCategoryByName(categoryName);
    const categoryID = category.length && category[0].category_id;
    // 根据商品分类id获取首页展示的商品信息

    const Product = await productDao.GetPromoProductById(~~categoryID);
    ctx.body = {
      code: 0,
      Product
    }
  },
  /**
   * 根据商品分类名称获取热门商品信息
   * @param {Object} ctx
   */
  GetHotProduct: async ctx => {
    let { categoryName } = ctx.request.body;
    const categoryID = [];

    for (let i = 0; i < categoryName.length; i++) {
      // 根据商品分类名称获取分类id
      const category_id = await productDao.GetCategoryId(categoryName[i]);
      categoryID.push(category_id);
    }
    // 根据商品分类id获取商品信息
    const Product = await productDao.GetProductByCategory(categoryID, 0, 7);

    ctx.body = {
      code: '001',
      Product
    }
  },
  /**
   * 分页获取所有的商品信息
   * @param {Object} ctx
   */
  GetAllProduct: async ctx => {
    let { currentPage, pageSize } = ctx.request.body;
    // 计算开始索引
    const offset = (currentPage - 1) * pageSize;
    const Product = await productDao.GetAllProduct(offset, pageSize);
    // 获取所有的商品数量,用于前端分页计算
    const total = (await productDao.GetAllProduct()).length;
    ctx.body = {
      code: '001',
      Product,
      total
    }
  },
  /**
   * 根据分类id,分页获取商品信息
   * @param {Object} ctx
   */
  GetProductByCategory: async ctx => {
    let { categoryID, currentPage, pageSize } = ctx.request.body;
    // 计算开始索引
    const offset = (currentPage - 1) * pageSize;
    // 分页获取该分类的商品信息
    const Product = await productDao.GetProductByCategory(categoryID, offset, pageSize);

    // 获取该分类所有的商品数量,用于前端分页计算
    const total = Product.length;

    ctx.body = {
      code: '001',
      Product,
      total
    }
  },
  /**
   * 根据搜索条件,分页获取商品信息
   * @param {Object} ctx
   */
  GetProductBySearch: async ctx => {
    let { search, currentPage, pageSize } = ctx.request.body;
    // 计算开始索引
    const offset = (currentPage - 1) * pageSize;
    // 获取分类列表
    const category = await productDao.GetCategory();

    let Product;
    let total;

    for (let i = 0; i < category.length; i++) {
      // 如果搜索条件为某个分类名称,直接返回该分类的商品信息
      if (search == category[i].category_name) {
        // 获取该分类的商品信息
        Product = await productDao.GetProductByCategory(category[i].category_id, offset, pageSize);
        // 获取该分类所有的商品数量,用于前端分页计算
        total = Product.length;

        ctx.body = {
          code: '001',
          Product,
          total
        }
        return;
      }
    }
    // 否则返回根据查询条件模糊查询的商品分页结果
    Product = await productDao.GetProductBySearch(search, offset, pageSize);
    // 获取模糊查询的商品结果总数
    total = Product.length;

    ctx.body = {
      code: '001',
      Product,
      total
    }
  },

  /**
   * 根据商品id,获取商品详细信息
   * @param {Object} ctx
   */
  GetDetails: async ctx => {
    let { productID } = ctx.request.body;

    const Product = await productDao.GetProductByProductId(productID);

    ctx.body = {
      code: '001',
      Product,
    }
  },
  /**
   * 根据商品id,获取商品图片,用于食品详情的页面展示
   * @param {Object} ctx
   */
  GetDetailsPicture: async ctx => {
    const { productID } = ctx.request.body;
    const ProductPicture = await productDao.GetDetailsPicture(productID);
    if (ProductPicture.length === 1) {
      ctx.body = {
        code: '001',
        ProductPicture: ProductPicture[0],
        msg: 'success'
      }
      return;
    }
    ctx.body = {
      code: '002',
      msg: '加载图片失败'
    }
  },

  /**
  * 获取上架商品
  * @param {Object} ctx
  */
  GetAddProduct: async ctx => {
    const { from_user } = ctx.request.body;
    // // 根据商品上架商家获取
    const result = await productDao.GetAddProductByFromUser(from_user);
    if (result.length) {
      ctx.body = {
        code: '001',
        saleList: result,
        msg: 'success'
      }
      return;
    }
    ctx.body = {
      code: '002',
      msg: '查询失败'
    }
  },
  /**
  * 上架商品
  * @param {Object} ctx
  */
  AddProduct: async ctx => {
    const { user_id, productsData } = ctx.req.body;
    const _productsData = JSON.parse(productsData);
    const fileArr = ctx.req.files; //图片数组

    // // 根据商品分类名称获取分类id
    const category = await productDao.GetCategoryByName(_productsData.category_name);
    const categoryID = category.length && category[0].category_id;
    const data = {
      from_user: user_id,
      product_picture: 'public' + fileArr[0].path.split('public')[1],
      product_name: _productsData.product_name,
      product_num: _productsData.product_num,
      product_price: _productsData.product_price,
      product_selling_price: _productsData.product_selling_price,
      product_intro: _productsData.product_intro,
      product_title: _productsData.product_title,
      deliveryType: _productsData.deliveryType,
      category_id: categoryID,
      product_id: 'Damons7' + generateUUID()
    }
    const result = await productDao.AddProduct(data);
    const detail = await productDao.AddDetailsPicture(data.product_id, fileArr.map(item => 'public' + item.path.split('public')[1]))
    if (result.length === 1 && detail.length === 1) {
      ctx.body = {
        code: '001',
        result: result,
        msg: '上架成功'
      }
      return;
    }
    ctx.body = {
      code: '002',
      msg: '上架失败'
    }
  },
  /**
  * 更新上架商品
  * @param {Object} ctx
  */
  UpdateProduct: async ctx => {
    const { productsData } = ctx.req.body;
    const _productsData = JSON.parse(productsData);
    const fileArr = ctx.req.files; //图片数组

    // 根据商品分类名称获取分类id
    const category = await productDao.GetCategoryByName(_productsData.category_name);
    const categoryID = category.length && category[0].category_id;
    const data = {
      product_picture: 'public' + fileArr[0].path.split('public')[1],
      product_name: _productsData.product_name,
      product_num: _productsData.product_num,
      product_price: _productsData.product_price,
      product_selling_price: _productsData.product_selling_price,
      product_intro: _productsData.product_intro,
      product_title: _productsData.product_title,
      deliveryType: _productsData.deliveryType,
      category_id: categoryID
    }
    const result = await productDao.UpdateProduct(_productsData.product_id, data);
    const detail = await productDao.UpdateDetailsPicture(_productsData.product_id, fileArr.map(item => 'public' + item.path.split('public')[1]))
    if (result.ok === 1 && detail.ok === 1) {
      ctx.body = {
        code: '001',
        msg: '更新成功'
      }
      return;
    }
    ctx.body = {
      code: '002',
      msg: '更新失败'
    }
  },

  /**
* 下架商品
* @param {Object} ctx
*/
  ReturnProduct: async ctx => {
    const { product_id } = ctx.request.body;
    const result = await productDao.UpdateProductState(product_id);
    
    if (result.ok === 1) {
      ctx.body = {
        code: '001',
        msg: '该商品已下架'
      }
      return;
    }
    ctx.body = {
      code: '002',
      msg: '下架失败'
    }
  }
}