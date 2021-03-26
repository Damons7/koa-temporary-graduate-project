/*
 * @Description: 用户模块控制器
 * @Author: 李鸿智
 */
const userDao = require('../dao/userDao'),  //用户Dao持久层
    User = require('../models/User'),//引入user
    validateLoginInput = require('../tools/validation/login'),//登录验证表单
    validateRegisterInput = require('../tools/validation/register'),//注册验证表单
    bcryptTools = require('../tools/bcrypt.js'),//加密信息
    jwt = require('jsonwebtoken'),//token引入
    tokenConfig = require('../tools/token/config'),
    gravatar = require('gravatar'); //初始化头像

module.exports = {

    /**
     * 用户登录
     * @param {Object} ctx
     */
    Login: async ctx => {

        const { email, password } = ctx.request.body;
        const { errors, isValid } = validateLoginInput(ctx.request.body);
        //判断表单验证
        if (!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        }

        const findResult = await userDao.findByEmail(email);   //查询数据库是否存在此人email
        const user = findResult[0]

        //查询不到数据时
        if (findResult.length === 0) {
            ctx.status = 200;
            ctx.body = {
                msg: '用户不存在',
                code: 1
            }
            return;
        }

        //查到唯一用户
        if (findResult.length === 1) {
            //查到，验证密码(解密)
            const res = await bcryptTools.compareSync(password, user.password);
            if (res) {
                //验证通过，设置token
                const payload = { id: user.id, name: user.name, avatar: user.avatar };
                const token = jwt.sign(payload, tokenConfig.SECREORKEY, { expiresIn: "180 days" });
                ctx.status = 200;
                ctx.body = {
                    code: 0,
                    success: true,
                    user: {
                        userName: user.name,
                        uuid: user.uuid,
                        token: "Bearer " + token,
                    }
                }

                // const loginUser = {
                //     uuid: user.uuid,
                //     sessionKey: session_key
                //   };
                //   // 保存用户信息到session
                //   ctx.session.user = loginUser;

            } else {
                ctx.status = 200;
                ctx.body = {
                    msg: '密码错误',
                    code: 1
                }
            }
            return;
        }

        //返回未知错误
        ctx.body = {
            code: 1,
            msg: '未知错误'
        }
    },

    /**
     * 用户注册
     * @param {Object} ctx
     */
    Register: async ctx => {

        const { email, password } = ctx.request.body;
        const { errors, isValid } = validateRegisterInput(ctx.request.body);

        //判断表单验证
        if (!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        }

        const res = await userDao.findByEmail(email);

        if (res.length === 0) {
            const avatar = gravatar.url('email', { s: '200', r: 'pg', d: 'mm' });
            const newUser = new User({
                name: email,
                email: email,
                avatar,
                password: bcryptTools.enbcrypt(password),  //对password加密
            });

            await newUser.save().then(user => {
                ctx.body = user;
                ctx.body = {
                    code: 0,
                    msg: '注册成功'
                }
            }).catch(err => {
                console.log(err);
                ctx.body = {
                    code: 1,
                    msg: '注册失败'
                }
            })
            return;
        }
        if (res.length === 1) {
            ctx.status = 200;
            ctx.body = {
                code: 1,
                msg: '该用户已注册过了'
            }
            return;
        }

        ctx.body = {
            code: 1,
            msg: '未知错误'
        }
    },

    /**
     * 获取用户信息
     * @param {Object} ctx
     */
    GetUserData: async ctx => {
        const { user_id } = ctx.request.body;
        const findResult = await userDao.findByUserId(user_id);
        if (findResult.length == 1) {
            ctx.body = {
                code: '001',
                msg: 'success',
                user: findResult
            }
            return;
        }
        //返回未知错误
        ctx.body = {
            code: "002",
            msg: '未知错误'
        }
    },

    /**
     * 修改用户信息
     * @param {Object} ctx
     */
    UpdateUserData: async ctx => {
        const { updateData, user_id } = ctx.request.body;
        const updateResult = await userDao.updateUserByUserId(user_id, updateData);
        if (updateResult.ok == 1) {
            ctx.body = {
                code: '001',
                msg: '信息更新成功',
            }
            return;
        }
        //返回错误
        ctx.body = {
            code: "002",
            msg: '信息更新失败'
        }
    },

    /**
     * 修改用户密码
     * @param {Object} ctx
     */
    UpdateUserPassword: async ctx => {
        const { oldPassword, newPassword, user_id } = ctx.request.body;
        const user = await userDao.findByUserId(user_id);
        if (user.length === 1) {
            //查到，验证密码(解密)
            const res = await bcryptTools.compareSync(oldPassword, user[0].password);
            if (res) {
                const _newPassword = bcryptTools.enbcrypt(newPassword);  //对newPassword加密
                const updateResult = await userDao.updatePasswordByUserId(user_id, _newPassword);
                updateResult.ok === 1 ?
                    ctx.body = {
                        code: '001',
                        msg: '修改成功',
                    } :
                    ctx.body = {
                        code: '002',
                        msg: '修改失败',
                    }
            } else {
                ctx.body = {
                    code: '002',
                    msg: '原密码错误',
                }
            }
            return;
        }
        //返回未知错误
        ctx.body = {
            code: "002",
            msg: '未知错误'
        }
    },

    /**
    * 修改用户头像
    * @param {Object} ctx
    */
    UploadAvatar: async ctx => {
        const { user_id } = ctx.req.body;
        const { filename } = ctx.req.file
        const prefix = 'public/imgs/userAvatar/'
        const updateResult = await userDao.updateAvatarByUserId(user_id, prefix+filename);
        updateResult.ok === 1 ?
            ctx.body = {
                code: '001',
                msg: '修改成功',
            } : ctx.body = {
                code: '002',
                msg: '修改失败',
            }
    },
    /**
     * 获取用户地址
     * @param {Object} ctx
     */
    GetAddress: async ctx => {

        const { user_id } = ctx.request.body;
        // 通过id获取地址
        const addressGroup = await userDao.findAddressByUserID(user_id);

        // 该用户没有创建任何地址
        if (addressGroup.length == 0) {
            ctx.body = {
                code: '002',
                msg: '该用户没有创建地址'
            }
            return;
        }

        ctx.status = 200;
        ctx.body = {
            code: '001',
            address: addressGroup
        }
    },

    /**
     * 添加用户地址
     * @param {Object} ctx
     */
    AddAddress: async ctx => {

        const { user_id, addressInfos } = ctx.request.body;
        // 获取地址
        const addressGroup = await userDao.findAddressByUserID(user_id);

        // 地址超过5个，不能继续添加
        if (addressGroup.length > 4) {
            ctx.body = {
                code: '002',
                msg: '该用户地址已满'
            }
            return;
        }

        const { isDefault, address, name, phone } = addressInfos;

        //修改默认地址
        if (isDefault) {
            const result = await userDao.updateAddressIsDefaultByUserId(user_id)
            if (result.ok !== 1) {
                ctx.body = {
                    code: '002',
                    msg: '默认地址更新失败'
                }
            }
        }

        //添加地址
        const result = await userDao.addAddress(
            [
                {
                    "user_id": user_id,
                    "name": name,
                    "phone": phone,
                    "address": address,
                    "isDefault": isDefault
                }
            ]
        );
        if (result.length !== 1) {
            ctx.body = {
                code: '002',
                msg: '添加地址失败'
            }
        }

        ctx.status = 200;
        ctx.body = {
            code: '001',
            msg: '添加成功',
            address: result
        }
    },

    /**
     * 删除用户地址
     * @param {Object} ctx
     */
    DelAddress: async ctx => {

        const { _id } = ctx.request.body;
        // 删除地址
        const res = await userDao.delAddressBy_id(_id);

        // 地址删除成功
        if (res.deletedCount === 1) {
            ctx.body = {
                code: '001',
                msg: '删除地址成功'
            }
            return;
        }
        ctx.body = {
            code: '002',
            msg: '删除失败成功'
        }
        return;
    },                                                                                                                                                                                                                

    /**
     * 更新用户地址
     * @param {Object} ctx
     */
    UpdateAddress: async ctx => {

        const { _id, addressInfos } = ctx.request.body;
        const { user_id, phone, name, address, isDefault, updateDate } = addressInfos

        //修改默认地址(取消)
        if (isDefault) {
            const result = await userDao.updateAddressIsDefaultByUserId(user_id)
            if (result.ok !== 1) {
                ctx.body = {
                    code: '002',
                    msg: '默认地址更新失败'
                }
            }
        }
        // 更新地址的数据
        const updateData = {
            phone,
            name,
            address,
            isDefault,
            updateDate
        }
        // 更新地址
        const updateRes = await userDao.updateAddressById(_id, updateData);

        if (updateRes.ok !== 1) {
            ctx.body = {
                code: '002',
                msg: '更新地址失败'
            }
        }

        ctx.status = 200;
        ctx.body = {
            code: '001',
            msg: '更新成功'
        }
    }
};