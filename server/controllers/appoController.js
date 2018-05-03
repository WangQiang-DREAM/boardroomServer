
const uuid = require('uuid');
const util = require('../util');
const readline = require('readline');
const fs = require('fs');
const appoModel = require('../models/appoModel')
const userModel = require('../models/userModel');
const exportConfig = require('../../config/exportConfig');
const sendEmail = require('../mail');
const sendSMS = require('../sms');
const moment = require('moment');
const phonecode = require('../phonecode');

/**
 * 返回预约所有信息接口
 * @param {*} ctx
 * @param {*} next
 */
exports.queryAppoInfo = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let returnAppoInfo = await appoModel.queryAppoInfo(body)
        let Room = {
            docs: returnAppoInfo.docs,
            pagination: {
                total: returnAppoInfo.total,
                pageSize: returnAppoInfo.limit,
                current: returnAppoInfo.page,
            },
        };
        if (returnAppoInfo.docs) {
            exportConfig(ctx, 'success', Room);
        } else {
            exportConfig(ctx, 'error', Room);
        }
        return next;
    } catch (err) {
        console.log(err);
    }
};

/**
 * 修改预约状态接口
 * @param {*} ctx
 * @param {*} next
 */
exports.changeAppoStatus = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        console.log(body)
        let AppoInfo = {
            appoId: body.appoId,
            status: body.status,
        };
        let changeRes = await appoModel.changeAppoStatus(AppoInfo);
        let emailStatus = body.emailStatus
        if (changeRes.changeStatusRes.ok === 1) {
            let returnObj = {
                dbResult: changeRes.changeNewAppo,
                ok: 1,
            };
            exportConfig(ctx, 'changeRoomSuccess', returnObj);
            switch (emailStatus) {
                case 'reject':
                sendEmail(body.email, '预约结果', '很抱歉，您的预约已被拒绝，请再次预约！')
                break;
                case 'receive':
                //sendEmail(body.email, '预约结果', '您的预约已成功，请及时前往！');
                let date = new Date()
                const h = date.getHours();
                const m = date.getMinutes();
                const time = h +'点'+ m + '分';
                sendSMS.sendSms(body.phone, 'SMS_133155051',time);
                break;
                case 'checkin':
                sendEmail(body.email, '入住通知', '您已成功入住' + body.roomOrder + '房间' + body.bedId + '号床')
                break;
                case 'nocheckin':
                sendEmail(body.email, '预约结果', '您的预约已结束！')
                break;
            }
        } else {
            let returnObj = {
                dbResult: changeRes.changeNewAppo,
                ok: 0,
            };
            exportConfig(ctx, 'changeRoomFail', returnObj);
        }
        return next;
    } catch (error) {
        console.log(error);
    }
};

/**
 * 添加预约
 * @param {*} ctx
 * @param {*} next
 */
exports.addAppo = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let manager  = await userModel.queryUserName()
        let i = Math.floor(Math.random() * 2)
        let apposinfo = {
            name: body.name,
            uid: body.uid,
            email: body.email,
            appoTime: body.appoTime,
            contactWay: body.phone,
            receptionist: manager[i].name,
            avatar: body.avatar,
            roomOrder:body.roomOrder,
        }
        const addRes = await appoModel.addAppo(apposinfo)
        if (addRes) {
            exportConfig(ctx, 'success', addRes);
        } else {
            exportConfig(ctx, 'error', addRes);
        }
        return next;
    } catch (error) {
        console.log(error);
    }
}; 