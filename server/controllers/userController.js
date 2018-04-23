const userModel = require('../models/userModel');
const util = require('../util');
const exportConfig = require('../../config/exportConfig');
const sendEmail = require('../mail')
const sendSms = require('../sms')
/**
 * 管理员登录
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
        let name = body.name;
        let roles = parseInt(body.roles);
        // 先检查是否已经添加
        let checkExist = await userModel.checkUserExist(userName);
        console.log(checkExist);
        if (checkExist.length > 0) {
            exportConfig(ctx, 'managerExist', { code: 1, msg: '管理员已经存在, 无需再添加' });
        } else {
            if (roles && userName) {
                let saveRes = await userModel.addManager(userName, name, roles);
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

/**
 * 删除管理员
 * @param {*} ctx
 * @param {*} next
 */
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

/**
 * 修改管理员密码
 * @param {*} ctx
 * @param {*} next
 */
exports.updateManagerPassword = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let ManagerInfo = {
            uid: body.uid,
            password: body.password,
        };
        let changeManagerRes = await userModel.updateManagerPassword(ManagerInfo);
        if (changeManagerRes.ok === 1) {
            let returnObj = {
                dbResult: changeManagerRes,
                ok: 1,
            };
            exportConfig(ctx, 'success', returnObj);
        } else {
            let returnObj = {
                dbResult: changeManagerRes,
                ok: 0,
            };
            exportConfig(ctx, 'error', returnObj);
        }
        return next;
    } catch (error) {
        console.log(error);
    }
};
/**
 * 查询用户
 * @param {*} ctx
 * @param {*} next
 */
exports.queryAllUsers = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let userInfo = await userModel.queryAllUsers(body);
        let user = {
            docs: userInfo.docs,
            pagination: {
                total: userInfo.total,
                pageSize: userInfo.limit,
                current: userInfo.page,
            },
        };
        if (userInfo.total) {
            exportConfig(ctx, 'success', user);
        } else {
            exportConfig(ctx, 'queryUserError', user);
        }
        return next;
    } catch (error) {
        exportConfig(ctx, 'error', {});
        console.log(error);
    }
};


/**
 * 查询评论
 * @param {*} ctx
 * @param {*} next
 */
exports.queryComments = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let commentsInfo = await userModel.queryComments(body)
        let comments = {
            docs: commentsInfo.docs,
            pagination: {
                total: commentsInfo.total,
                pageSize: commentsInfo.limit,
                current: commentsInfo.page,
            },
        };
        if (commentsInfo.total) {
            exportConfig(ctx, 'success', comments);
        } else {
            exportConfig(ctx, 'error', comments);
        }
        return next;
    } catch (error) {
        exportConfig(ctx, 'error', {});
        console.log(error);
    }
};
 
/**
 * 变更用户类型
 * @param {*} ctx
 * @param {*} next
 */
exports.updateUserType = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let typeInfo = {
            uid: body.uid,
            userType: body.userType,
        };
        let changeRes = await userModel.updateUserType(typeInfo);
        if (changeRes.ok === 1) {
            let returnObj = {
                dbResult: changeRes,
                ok: 1,
            };
            exportConfig(ctx, 'success', returnObj);
            if (body.userType == '1') {
                sendEmail(body.email, '退订成功！', '您已退订')
            }
        } else {
            let returnObj = {
                dbResult: changeRes,
                ok: 0,
            };
            exportConfig(ctx, 'error', returnObj);
        }
        return next;
    } catch (error) {
        console.log(error);
    }
};

/**
 * 变更用户信息
 * @param {*} ctx
 * @param {*} next
 */
exports.updateUserInfo = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let userInfo = {
            uid: body.uid,
            name: body.name,
            checkInTime:Date.parse(new Date),
            userType: body.userType,
            age: body.age,
            sex: body.sex,
            roomOrder:body.roomOrder,
            bedId:body.bedId,
            familyName: body.familyName,
            familyAddress: body.familyAddress,
            familyPhone: body.familyPhone,
            idCardNum: body.idCardNum,
        };
        let changeRes = await userModel.updateUserInfo(userInfo);
        if (changeRes.ok === 1) {
            let returnObj = {
                dbResult: changeRes,
                ok: 1,
            };
            exportConfig(ctx, 'success', returnObj);
            // if (body.userType == '1') {
            //     sendEmail(body.email, '退订成功！', '您已退订')
            // }
        } else {
            let returnObj = {
                dbResult: changeRes,
                ok: 0,
            };
            exportConfig(ctx, 'error', returnObj);
        }
        return next;
    } catch (error) {
        console.log(error);
    }
};

/**
 * 新用户注册
 * @param {*} ctx
 * @param {*} next
 */
let registerCode = ''
exports.newUserRegister = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let uidres = await userModel.queryUid();
        if (body.phoneVerificationCode == registerCode) {
            let userInfo = {
                email: body.email,
                uid: uidres.uid + 1,
                password: body.password,
                phone: body.phone
            };
            let changeRes = await userModel.newUserRegister(userInfo);
            console.log(changeRes)
            let returnObj = {
                dbResult: changeRes,
                ok: 1,
            };
            let Res = await userModel.changeUid(uidres._id);
            exportConfig(ctx, 'success', returnObj);
        } else {
            let returnObj = {
                dbResult: '验证码错误',
                ok: 0,
            };
            exportConfig(ctx, 'error', returnObj);
        }
        return next;
    } catch (error) {
        console.log(error);
    }
};

/**
 * 用户登录
 * @param {*} ctx
 * @param {*} next
 */
let loginCode = ''
exports.usersLogin = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        if(body.loginType == '1') {
            if (body.code == loginCode) {
                let userInfo = {
                    phone: body.phone,
                    type:'2'
                };
                let loginRes = await userModel.usersLogin(userInfo)
                if(loginRes) {
                    let returnObj = {
                        dbResult: loginRes,
                        ok: 1,
                    };
                    exportConfig(ctx, 'success', returnObj);
                } else {
                    let returnObj = {
                        dbResult: '登录失败',
                        ok: 0,
                    };
                    exportConfig(ctx, 'error', returnObj);
                }      
            } else {
                let returnObj = {
                    dbResult: '验证码错误',
                    ok: 0,
                };
                exportConfig(ctx, 'error', returnObj);
            }
        } else {
            let userInfo = {
                email: body.email,
                password:body.password,
                type: '1'
            };
            let loginRes = await userModel.usersLogin(userInfo)
            if (loginRes) {
                let returnObj = {
                    dbResult: loginRes,
                    ok: 1,
                };
                exportConfig(ctx, 'success', returnObj);
            } else {
                let returnObj = {
                    dbResult: '登录失败',
                    ok: 0,
                };
                exportConfig(ctx, 'error', returnObj);
            }      
        }
        
        return next;
    } catch (error) {
        console.log(error);
    }
};
//发送验证码
exports.sendSmsCode = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let code = ''
        for (let i = 0; i <6; i++) {
           if(i == 0) {
               code += Math.floor(Math.random() * 9+1)
           }  else {
               code += Math.floor(Math.random() * 10)
           }
        }
        if (body.type == 'register') {
            sendSms(body.phone, 'SMS_132675083', code)
            registerCode = code;
            console.log(registerCode)
            exportConfig(ctx, 'success', '发送成功');    
        } else {
            //sendSms(body.phone, 'SMS_133035239', code)
            loginCode = code;
            console.log(loginCode)
            exportConfig(ctx, 'success', '发送成功');    
        }
        
        return next;
    } catch (error) {
        console.log(error);
    }
};