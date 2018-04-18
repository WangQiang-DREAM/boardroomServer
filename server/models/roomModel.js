const { db } = require('../dbconfig/mongoose');
const roomDb = db.useDb('roomInfo');
const mongoosePaginate = require('./paginate'); 

// 连接room表
const roomSchema = require('../schema/roomSchema');
roomSchema.plugin(mongoosePaginate);
const room = roomDb.model('room', roomSchema);

const uuid = require('uuid');

/**
 * 定义房间表返回字段
 */
const returnRoomParams = `
    creator
    roomId
    roomOrder
    direction
    roomStatus
    status
    totalNum
    userNum
    commentNum
    creator
    createTime
    image
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
    const searchParams = ['roomOrder','direction', 'roomStatus', 'createTime','status'];
    const searchRules = {};
    let starttime = '';
    let endtime = '';
    searchParams
        .map(param => {
            if (params.querys[param]) {
                console.log(11)
                console.log(params.querys[param])
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
                    starttime = Date.parse(data.value[0])
                    endtime = Date.parse(data.value[1])
                    searchRules[data.key] = { $gte: starttime, $lte: endtime };
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    const roomInfo = await room.paginate(searchRules, roomParams);
    return roomInfo;
};


/**
 * 修改房间状态
 * @param {*} params
 */

exports.changeRoomStatus = async roomInfo => {
    let roomOrder = roomInfo.roomOrder;
    let status = roomInfo.status;
    const conditions = { roomOrder: roomOrder };
    const update = { $set: { status: status } };
    const options = { upsert: true };
    const changeStatusRes = await room.update(conditions, update, options);
    const changeNewRoom = await room.find({ roomOrder: roomOrder })
    let roomresult = {
        changeStatusRes: changeStatusRes,
        changeNewRoom: changeNewRoom
    }
    return roomresult;
};

/**
 * 查询房间图片
 */
 exports.queryRoomImgByRoomOrder = roomOrder => {
     let resImg = room.findOne({roomOrder:roomOrder});
     return resImg;
 }

/**
* 上传房间图片
* @param {*} param
*/
exports.changeRoomPhoto = async param => {
    const conditions = { roomOrder: param.roomOrder};
    const update = { $set: { image: param.img } };
    const options = { upsert: true };
    const resImg = await room.update(conditions, update, options);
    return resImg
}

/**
* 删除房间图片
* @param {*} param
*/
exports.deleteRoomPhoto = async param => {
    let img = []
    if (param.image != null){
        img = (param.image).split(',')
    } else {
        img = null
    }
    const conditions = { roomOrder: param.roomOrder };
    const update = { $set: { image: img } };
    const options = { upsert: false };
    const resImg = await room.update(conditions, update, options);
    return resImg
}

/**
* 添加房间信息
* @param {*} param
*/
exports.addRoomInfo = async param => {
    const newRoom = new room({
        roomOrder: param.roomOrder,
        direction: param.direction,
        totalNum: param.totalNum,
        creator: param.creator,
        status: param.status,
        roomStatus: '0',
        roomId: uuid(),
        createTime: Date.parse(new Date()),
        userNum: 0,
        commentNum:0,
        image:null
    });
    const saveRes = await newRoom.save();
    return saveRes;
}

/**
 * 查询房间号是否存在/返回房间具体信息
 */
exports.checkRoomExist = async roomOrder => {
    const checkRoomExist = await room.find({ 'roomOrder': roomOrder });
    return checkRoomExist;
}

/**
* 房间入住人数变更
* @param {*} param
*/
exports.changeRoomUserNum = async param => {
    let roomOrder = param.roomOrder;
    let inc = param.inc;
    const conditions = { roomOrder: roomOrder };
    const update = { $inc: { userNum: inc } };
    const options = { upsert: true };
    const changeRes = await room.update(conditions, update, options);
    return changeRes;
}

/**
 * 修改房间情况
 * @param {*} param
 */
exports.change_RoomStatus = async param => {
    let roomOrder = param.roomOrder;
    let roomStatus = param.roomStatus;
    const conditions = { roomOrder: roomOrder };
    const update = { $set: { roomStatus: roomStatus } };
    const options = { upsert: true };
    const changeRes = await room.update(conditions, update, options);
    return changeRes;
};

/**
 * 修改房间评论数
 * @param {*} param
 */
exports.changeRoomCommentNum = async param => {
    let roomOrder = param.roomOrder;
    let commentNum = param.commentNum;
    const conditions = { roomOrder: roomOrder };
    const update = { $inc: { commentNum: commentNum } };
    const options = { upsert: true };
    const changeRes = await room.update(conditions, update, options);
    return changeRes;
};