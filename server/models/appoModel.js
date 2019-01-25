const { db } = require('../dbconfig/mongoose');
const roomDb = db.useDb('countroom');
const mongoosePaginate = require('./paginate'); 
const moment = require('moment')
/**
 * 连接appointment表
 */
const appoSchema = require('../schema/appoSchema');
appoSchema.plugin(mongoosePaginate);
const appo = roomDb.model('appo',appoSchema);
const uuid = require('uuid');
 
/**
 * 根据搜索条件返回会议室预约的所有信息
 * @param {*} params
 */
exports.queryAppoInfo = async params => {
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
    const searchParams = ['uid', 'department','appoTime','roomId','name','date','title','appoId'];
    const searchRules = {'status':'0'};
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
                if (data.key === 'name') {
                    searchRules[data.key] = new RegExp(data.value);
                } else if (data.key === 'title') {
                    searchRules[data.key] = new RegExp(data.value);
                }
                 else if (data.key === 'date') {
                    searchRules[data.key] = {
                        $gte: data.value[0],
                        $lte: data.value[1]
                    };
                } 
                else if (data.key === 'appoId') {
                    searchRules[data.key] = { $in: data.value }
                }
                else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    const appoInfo = await appo.paginate(searchRules, roomParams);
    return appoInfo;
}

/**
 *  
 */
exports.queryAppoInfoDetail = async params =>{
    let date = new Date().setHours(6, 0, 0, 0);
    let alldata = [];
    let appotime = "";
    for (let i = 0; i < 7; i++) {
        appotime = moment(date).format().substr(0, 10);
        let result = await appo.find({
            'roomId': params.roomId,
            'status': '0',
            'date': {
                $gte: appotime,
                $lte: appotime
            }
        });
        let day = {};
        let daytime = [];
        let uidobj = {};
        if (result.length > 0) {
            result.forEach(item => {
                daytime = [...daytime, ...item.appoTime]
                item.appoTime.forEach(ele => {
                    uidobj[ele] = item.uid
                })
            });
            day = {
                date: result[0].date,
                time: daytime,
                uidobj: uidobj
            };
        } else {
            day = {
                date: moment(date).format().substr(0, 10),
                time: [],
                uidobj: {}
            };
        }
        alldata.push(day);
        date = date + 60 * 60 * 1000 * 24;
    }
    return alldata
}
/**
 * 添加会议室预约
 * @param {*} params 
 */
exports.addAppo = async params => {
    const newAppo = new appo({
        appoId: uuid(),
        name: params.name,
        uid: params.uid,
        department: params.department,
        appoTime: params.appoTime,
        roomId: params.roomId,
        createTime: Date.parse(new Date),
        status: "0",
        date: params.date,
        title: params.title,
    });
    const saveRes = await newAppo.save();
    return saveRes;
}

/**
 * 判断预约是否冲突
 * @param {*} params 
 */
exports.judgeAppoConflict = async params =>{
    let conflictbyroom = [];
    let conflictbyuser = [];
    let timedata = params.time
    for (let i = 0; i < timedata.length; i++) {
        let res = await appo.find({
            'date': timedata[i].date,
            'status': '0',
            'appoTime': {$in:timedata[i].time}
        });
        if (res.length >0) {
            res.forEach(item=>{
                if (item.uid === params.uid) {
                   conflictbyroom = [...conflictbyroom, ...res]
                }
                if (item.roomId === params.roomId) {
                   conflictbyuser = [...conflictbyuser, ...res]
                }
            })
        }
    }
    
    if (conflictbyroom.length > 0 && conflictbyuser.length > 0) {
        let returnData = {
            type: 'all',
            data: [...conflictbyroom, ...conflictbyuser]
        }
        return returnData
    } else if (conflictbyroom.length > 0 && conflictbyuser.length === 0) {
        let returnData = {
            type: 'room',
            data: conflictbyroom
        }
        return returnData
    } else if (conflictbyroom.length === 0 && conflictbyuser.length > 0) {
        let returnData = {
            type: 'user',
            data: conflictbyuser
        }
        return returnData
    } else {
        let returnData = {
            type: 'success',
            data: []
        }
        return returnData
    }
}


/**
 * 删除会议室预约（修改预约状态）
 * @param {*} params
 */
exports.deleteAppo = async params => {
    let appoId = params.appoId;
    let status = params.status;
    const conditions = { appoId: {$in:appoId} };
    const update = { $set: { status: status } };
    const options = { upsert: false };
    const changeStatusRes = await appo.updateMany(conditions, update, options);
    return changeStatusRes;
};