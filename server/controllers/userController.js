const userModel = require('../models/userModel');
const util = require('../util');
const exportConfig = require('../../config/exportConfig');

/**
 * 用户注册
 * @param {*} ctx
 * @param {*} next
 */
exports.userRegister = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let phone = body.phone;
        // 先检查是否已经存在
        let checkExist = await userModel.checkUserExist(phone);
        if (checkExist.length > 0) {
            exportConfig(ctx, 'userExist', { code: 1, msg: '用户已经存在' });
        } else {
            if (body.phone) {
                let saveRes = await userModel.userRegister(body)
                exportConfig(ctx, 'addUserSuccess', { code: 0, addNew: saveRes });
            } else {
                exportConfig(ctx, 'addUserError', { code: 500 });
            }
        }
    } catch (error) {
        exportConfig(ctx, 'addUserError', { code: 500 });
        console.log(error);
    }
};

/**
 * 用户登录
 * @param {*} ctx
 * @param {*} next
 */
exports.userLogin = async (ctx, next) => {
    try {
        let body = ctx.request.body;
        let phone = body.phone;
        let password = body.password;
        let checkExist = await userModel.checkUserExist(phone);
        if (checkExist.length) {
            let loginRes = await userModel.userLogin(phone,password)
            if (loginRes != null) {
                exportConfig(ctx, 'login', loginRes);
            } else {
                exportConfig(ctx, 'passwordError', loginRes);
            }
        } else {
            exportConfig(ctx, 'noUser', checkExist);
        }
        return next;
    } catch (error) {
        console.log(error);
    }
};

