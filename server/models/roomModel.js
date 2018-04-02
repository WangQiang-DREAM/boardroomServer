const { db } = require('../dbconfig/mongoose');
const roomDb = db.useDb('roomInfo');
const mongoosePaginate = require('./paginate');

// 连接room表
const roomSchema = require('../schema/roomSchema');
roomSchema.plugin(mongoosePaginate);
const room = roomDb.model('room', roomSchema);


/**
 * 定义标签视频表返回字段
 */
const returnRoomParams = `
    creator
    roomId
    direction
    roomStatus
    totalNum
    userNum
    commentNum
    creator
    createTime
    enterTime
`;


/**
 * 根据搜索条件返回房间的所有信息
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
        select: returnRoomParams,
        page,
        limit,
        sort,
    };
    const searchParams = ['direction', 'roomStatus', 'creator', 'createTime', 'enterTime'];
    const searchRules = {};
    let starttime = '';
    let endtime = '';
    let starttime1 = '';
    let endtime1 = '';
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
                if (data.key === 'creator') {
                    searchRules[data.key] = new RegExp(data.value);
                } else if (data.key === 'createTime') {
                    starttime = data.value[0];
                    endtime = data.value[1];
                    searchRules['createTime'] = { $gte: starttime, $lte: endtime };
                } else if (data.key === 'enterTime') {
                    starttime1 = data.value[0];
                    endtime1 = data.value[1];
                    searchRules['createTime'] = { $gte: starttime1, $lte: endtime1 };
                } {
                    searchRules[data.key] = data.value;
                }
            }
        });
    const roomInfo = await room.paginate(searchRules, roomParams);
    return roomInfo;
};
