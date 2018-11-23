const {
    db
} = require('../dbconfig/mongoose');
const roomDb = db.useDb('countroom');
const mongoosePaginate = require('./paginate');

/**
 * 连接appointment表
 */
const roomStatusSchema = require('../schema/roomStatusSchema');
roomStatusSchema.plugin(mongoosePaginate);
const roomStatus = roomDb.model('roomStatus', roomStatusSchema);
const uuid = require('uuid');

/**
 * 
 * @param {*} params
 */
exports.queryRoomStatus = async params => {
    const page = Number(params.pagination.current);
    const limit = Number(params.pagination.pageSize);
    let sort = {};
    if (params.sort && params.sort.key) {
        sort = {
            [params.sort.key]: params.sort.order === 'ascend' ? 1 : -1,
        };
    };
    let roomParams = {
        page,
        limit,
        sort,
    };
    const searchParams = [ 'roomId', 'time', 'date'];
    const searchRules = {};
    let starttime = '';
    let endtime = '';
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
                if (data.key === 'date') {
                    searchRules[data.key] = new RegExp(data.value);
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    const appoInfo = await roomStatus.paginate(searchRules, roomParams);
    return appoInfo;
}

/**
 * 添加会议室状态
 * @param {*} params 
 */
exports.addRoomStatus = async params => {
    const newroomStatus = new roomStatus({
        roomStatusId:uuid(),
        roomId: params.roomId,
        date: params.date,
        time:{
             "9:00": false,
             "9:30": false,
             "10:00": false,
             "10:30": false,
             "11:00": false,
             "11:30": false,
             "12:00": false,
             "12:30": false,
             "13:00": false,
             "13:30": false,
             "14:00": false,
             "14:30": false,
             "15:00": false,
             "15:30": false,
             "16:00": false,
             "16:30": false,
             "17:00": false,
             "17:30": false
        }
    });
    const saveRes = await newroomStatus.save();
    return saveRes;
}

exports.update