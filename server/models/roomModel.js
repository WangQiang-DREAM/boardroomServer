const { db } = require('../dbconfig/mongoose');
const roomDb = db.useDb('countroom');
const mongoosePaginate = require('./paginate'); 

// 连接roomDetail表
const roomSchema = require('../schema/roomSchema');
roomSchema.plugin(mongoosePaginate);
const room = roomDb.model('room', roomSchema);
const uuid = require('uuid');


/**
 * 根据搜索条件返回会议室的所有信息
 * @param {*} params
 */
exports.queryRoomInfo = async params => {
    const page = Number(params.pagination.current);
    const limit = Number(params.pagination.pageSize);
    let sort = {};
    if (params.sort && params.sort.key) {
        sort = {
            [params.sort.key]: params.sort.order === 'ascend' ? 1 : -1,
        };
    }
    let roomParams = {
        page,
        limit,
        sort,
    };
    const searchParams = ['roomId', 'roomName', 'roomFloor', 'peopleNum', 'status'];
    const searchRules = {};
    searchParams
        .map(param => {
            if (params.querys[param]) {
                return {
                    key: param,
                    value: params.querys[param],
                };
            } else {
                return null;
            }
        })
        .forEach(data => {
            if (data) {
                if (data.key == 'roomName') {
                    searchRules[data.key] = new RegExp(data.value);
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    const roomInfo = await room.paginate(searchRules, roomParams);
    return roomInfo;
};



