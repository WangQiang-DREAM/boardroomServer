const uuid = require('uuid');
const util = require('../util');
const readline = require('readline');
const fs = require('fs');
const roomModel = require('../models/roomModel');
const exportConfig = require('../../config/exportConfig');



/**
 * 返回房间所有信息接口
 * @param {*} ctx
 * @param {*} next
 */
exports.queryRoomInfo = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let returnRoomInfo = await roomModel.queryRoomInfo(body);
        let Room = {
            docs: returnRoomInfo.docs,
            pagination: {
                total: returnRoomInfo.total,
                pageSize: returnRoomInfo.limit,
                current: returnRoomInfo.page,
            },
        };
        if (returnRoomInfo.docs) {
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
 * 修改房间状态接口
 * @param {*} ctx
 * @param {*} next
 */
exports.changeRoomStatus = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let RoomInfo = {
            roomOrder: body.roomOrder,
            status: body.status,
        };
        let changeRoomsRes = await roomModel.changeRoomStatus(RoomInfo);
        if (changeRoomsRes.changeStatusRes.ok === 1) {
            let returnObj = {
                dbResult: changeRoomsRes,
                ok: 1,
            };
            exportConfig(ctx, 'changeRoomSuccess', returnObj);
        } else {
            let returnObj = {
                dbResult: changeRoomsRes,
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
 * 添加房间信息接口
 * @param {*} ctx
 * @param {*} next
 */
exports.addRoomInfo = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        console.log(body)
    } catch (error) {
        exportConfig(ctx, 'error', { code: 500 });
        console.log(error);
    }
};

//上传房间图片
exports.changeRoomPhoto = async (params,imgname) => {
    let img = []
    if (params.image.length > 1 ) {
        img = (params.image).split(',');
        let newUrl = 'http://localhost:8080/house/' + imgname;
        img.push(newUrl);
    } else {
        let newUrl = 'http://localhost:8080/house/' + imgname;
        img.push(newUrl);
    }
        
    let param = {
        img: img,
        roomOrder: params.roomOrder,
    }
    let changeRes = await roomModel.changeRoomPhoto(param);
    return changeRes
}

//删除房间图片
exports.deleteRoomPhoto = async (ctx, next) => {
    let bodystring = ctx.request.query.body;
    let body = util.parseJson(bodystring);
    let changeRes = await roomModel.deleteRoomPhoto(body);
    let resImg = {
        status: '删除成功',
        data: changeRes
    }
    if (changeRes.ok == 1) {
        exportConfig(ctx, 'success', resImg);
    } else {
        exportConfig(ctx, 'error', changeRes);
    }
    return next;
}


//查询房间图片
exports.queryRoomImgByRoomOrder = async (ctx, next) => {
    try {
        let bodystring = ctx.request.query.body;
        let body = util.parseJson(bodystring);
        let resImg = await roomModel.queryRoomImgByRoomOrder(body.roomOrder);
        let RoomImg = {
            docs: resImg
        };
        if (resImg) {
            exportConfig(ctx, 'success', RoomImg);
        } else {
            exportConfig(ctx, 'error', RoomImg);
        }
        return next;
    } catch (error) {
        exportConfig(ctx, 'error', { code: 500 });
        console.log(error);
    }
};



