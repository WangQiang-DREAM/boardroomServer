const userModel = require('../models/userModel');
const util = require('../util');
const exportConfig = require('../../config/exportConfig');
const uuid = require('uuid')

let Code = ""
let userInfo = ''
/**
 * 
 * @param {*} ctx 
 * @param {*} next 
 * @description  根据用户微信信息登录
 */
exports.queryUserWechat = async(ctx, next) => {
    try {
        let body = ctx.request.query;
        let userWechat = await userModel.wechatLogin(body.nickname);
        userInfo = userWechat;
        const loginRes = {
            code:0,
            data:"登陆成功"
        }
        exportConfig(ctx, 'success', loginRes);
        return next;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 
 * @param {*} ctx 
 * @param {*} next 
 * @description 获取二维码字符串
 */
exports.sendScanCode = (ctx, next) => {
    try {
        userInfo = "";
        let body = ctx.request.query;
        Code = uuid();
        exportConfig(ctx, 'success', Code);
        return next;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 
 * @param {*} ctx 
 * @param {*} next 
 * @description 确认用户
 */
exports.confirmUser = (ctx, next) => {
    try {
        let body = ctx.request.query;
        if (body.uuid == Code) {
           const loginRes = '确认用户成功!';
           exportConfig(ctx, 'success', loginRes);
           return next;
        } else {
            const loginRes = {
                code: 1,
                data: "确认用户失败"
            }
            exportConfig(ctx, 'error', loginRes);
            return next;
        }
        
    } catch (error) {
        console.log(error);
    }
}

/**
 * 
 * @param {*} ctx 
 * @param {*} next 
 * @description 轮询获取用户信息
 */
exports.getUserInfo = (ctx, next) => {
    try {
        if (userInfo != '') {
            let resUser = userInfo;
            userInfo = ""
            exportConfig(ctx, 'success', resUser);
        } else {
            exportConfig(ctx, 'error', '失败');
        }
    } catch (error) {
        console.log(error)
    }
}