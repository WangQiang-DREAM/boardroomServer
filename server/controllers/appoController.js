
const util = require('../util');
const appoModel = require('../models/appoModel')
const exportConfig = require('../../config/exportConfig');

/**
 * 返回会议室预约所有信息
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
 * 添加新预约
 * @param {*} ctx 
 * @param {*} next 
 */
exports.addAppo = async (ctx, next) => {
    let body = ctx.request.body;
    if (body.roomId && body.uid) {
        let saveRes = await appoModel.addAppo(body);
        exportConfig(ctx, 'success', {
            code: 0,
            addNew: saveRes
        });
        return next
    } else {
        exportConfig(ctx, 'error', {
            code: 500
        });
    }
}

/**
 * 删除预约
 * @param {*} ctx
 * @param {*} next
 */
exports.deleteAppo = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let remove = await appoModel.deleteAppo(body)
        let removeRes = {
            ok: 1,
            result: remove,
        }
        exportConfig(ctx, 'deleteAppoSuccess', removeRes);
        return next;
    } catch (error) {
        exportConfig(ctx, 'deleteAppoError', {
            ok: 0
        });
        console.log(error);
    }
}