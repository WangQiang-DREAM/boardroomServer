const uuid = require('uuid');
const util = require('../util');
const readline = require('readline');
const fs = require('fs');
const appoModel = require('../models/appoModel')
const exportConfig = require('../../config/exportConfig');
const sendEmail = require('../mail')

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
                break
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