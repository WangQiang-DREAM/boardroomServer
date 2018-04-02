const userModel = require('../models/userModel');
const util = require('../util');
const exportConfig = require('../../config/exportConfig');

/**
 * 登录
 * @param {*} ctx
 * @param {*} next
 */


exports.loginIn = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let username = body.username;
        let password = body.password;
        let loginRescheck = await userModel.loginIncheck(username);
        if (loginRescheck.length) {
            let loginRes = await userModel.loginIn(username, password);
            if (loginRes != null) {
                console.log(loginRes)
                exportConfig(ctx, 'login', loginRes);
            } else {
                exportConfig(ctx, 'passwordError', loginRes);
            }   
        } else {
            exportConfig(ctx, 'noUser', loginRescheck);
        }
        return next;
    } catch (error) {
        console.log(error);
    }
};
exports.loginOut = async (ctx, next) => {
    try {
        let data = {};
        exportConfig(ctx, 'logout', data);
        return next;
    } catch (error) {
        console.log(error);
    }
}
/**
 * 返回所有管理员userName
 * @param {*} ctx
 * @param {*} next
 */
exports.queryUserName = async (ctx, next ) => {
    try {
        let User = await userModel.queryUserName();
        if (User.length) {
            exportConfig(ctx, 'queryUserSuccess', User);
        } else {
            exportConfig(ctx, 'queryUserError', User);
        }
        return next;
    } catch (error) {
        console.log(error);
    }
};

/**
 * 查询管理员
 * @param {*} ctx
 * @param {*} next
 */
exports.queryAllUser = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let userInfo = await userModel.queryAllUser(body);
        let user = {
            docs: userInfo.docs,
            pagination: {
                total: userInfo.total,
                pageSize: userInfo.limit,
                current: userInfo.page,
            },
        };
        if (userInfo.total) {
            exportConfig(ctx, 'queryUserSuccess', user);
        } else {
            exportConfig(ctx, 'queryUserError', user);
        }
        return next;
    } catch (error) {
        exportConfig(ctx, 'queryUserError', {});
        console.log(error);
    }
};


/**
 * 增加管理员
 * @param {*} ctx
 * @param {*} next
 */
exports.addManager = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let userName = body.username;
        let roles = parseInt(body.roles);
        // 先检查是否已经添加
        let checkExist = await userModel.checkUserExist(userName);
        console.log(checkExist);
        if (checkExist.length > 0) {
            exportConfig(ctx, 'managerExist', { code: 1, msg: '管理员已经存在, 无需再添加' });
        } else {
            if (roles && userName) {
                let saveRes = await userModel.addManager(userName, roles);
                exportConfig(ctx, 'addManagerSuccess', { code: 0, addNew: saveRes });
            } else {
                exportConfig(ctx, 'addManagerError', { code: 500 });
            }
        }
    } catch (error) {
        exportConfig(ctx, 'addManagerError', { code: 500 });
        console.log(error);
    }
};

exports.delManager = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let uid = body.uid;
        let remove = await userModel.delManager(uid);
        console.log(remove);
        let removeRes = {
            ok: 1,
            result: remove,
        }
        exportConfig(ctx, 'delManagerSuccess', removeRes);
        return next;
    } catch (error) {
        exportConfig(ctx, 'delManagerError', { ok: 0 });
        console.log(error);
    }
}
