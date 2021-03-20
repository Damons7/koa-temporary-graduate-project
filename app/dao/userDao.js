/*
 * @Description: 用户模块数据持久层
 * @Author: 李鸿智
 */

const User = require('../models/User');
const Address = require('../models/Address');
module.exports = {
  //查找用户
  findByUserId: async user_id => {
    return await User.find({ uuid: user_id });
  },
  //通过email查找用户
  findByEmail: async email => {
    return await User.find({ email: email });
  },
  //通过id查找用户
  findById: async id => {
    return await User.findById(id);
  },
  //通过用户id（user_id）查找地址
  findAddressByUserID: async user_id => {
    return await Address.find({ user_id: user_id }).sort({ isDefault: -1 });
  },
  //通过用户id（user_id）更新用户数据
  updateUserByUserId: async (user_id, updateData) => {
    updateData.updateDate = new Date()
    return await User.updateOne({ uuid: user_id }, { $set: updateData });
  },
  //通过用户id（user_id）修改密码
  updatePasswordByUserId: async (user_id, newPassword) => {
    return await User.updateOne({ uuid: user_id }, { $set: { password: newPassword, updateDate: new Date() } });
  },
  //通过用户id（user_id）修改头像
  updateAvatarByUserId: async (user_id, filename) => {
    return await User.updateOne({ uuid: user_id }, { $set: { avatar: filename, updateDate: new Date() } });
  },
  //修改默认地址
  updateAddressIsDefaultByUserId: async user_id => {
    return await Address.updateOne({ user_id: user_id, isDefault: true }, { $set: { isDefault: false } });
  },
  //添加地址
  addAddress: async data => {
    return await Address.insertMany(data);
  },
  //通过_id删除地址
  delAddressBy_id: async _id => {
    return await Address.deleteOne({ _id: _id });
  },
  //更新地址
  updateAddressById: async (_id, updateData) => {
    return await Address.updateOne({ _id: _id }, { $set: updateData });
  }
}