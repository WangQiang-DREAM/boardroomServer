const uuid = require('uuid');
const util = require('../util');
const readline = require('readline');
const fs = require('fs');
const roomModel = require('../models/roomModel');
const exportConfig = require('../../config/exportConfig');

/**
 * 返回视频所有信息接口
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