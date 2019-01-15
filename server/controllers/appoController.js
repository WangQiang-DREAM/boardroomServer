
const util = require('../util');
const appoModel = require('../models/appoModel')
const exportConfig = require('../../config/exportConfig');

/**
 * 分页返回会议室预约信息
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

exports.queryAppoInfoDetail = async(ctx,next)=>{
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let returnAppoInfo = await appoModel.queryAppoInfoDetail(body);
        if (returnAppoInfo.length) {
            exportConfig(ctx, 'success', returnAppoInfo);
        } else {
            exportConfig(ctx, 'error', returnAppoInfo);
        }
        return next;
    } catch (err) {
        console.log(err);
    }
}
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
 * 判断预约是否产生冲突
 */
exports.judgeAppoConflict = async(ctx,next) =>{
    let body = ctx.request.body;
    if (body.roomId && body.uid) {
       let appoRes = await appoModel.judgeAppoConflict(body);
       if (appoRes.type === 'all') {
            exportConfig(ctx, 'appoConflictError', {
               code: 1,
               data: appoRes.data
            });
       } else if (appoRes.type === 'room') {
            exportConfig(ctx, 'appoConflictError', {
                code: 2,
                data: appoRes.data
            });
       } else if (appoRes.type==='user') {
            exportConfig(ctx, 'appoConflictError', {
                code: 3,
                data: appoRes.data
            });
       } else {
            exportConfig(ctx, 'appoConflictSuccess', {
                code: 0,
                data: appoRes.data
            });
       }
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
        let remove = await appoModel.deleteAppo(body);
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