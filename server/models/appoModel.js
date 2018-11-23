const { db } = require('../dbconfig/mongoose');
const roomDb = db.useDb('countroom');
const mongoosePaginate = require('./paginate'); 

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
        title: params.title
    });
    const saveRes = await newAppo.save();
    return saveRes;
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