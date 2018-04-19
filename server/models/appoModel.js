const { db } = require('../dbconfig/mongoose');
const roomDb = db.useDb('roomInfo');
const mongoosePaginate = require('./paginate'); 

// 连接appointment表
const appoSchema = require('../schema/appoSchema');
appoSchema.plugin(mongoosePaginate);
const appo = roomDb.model('appo',appoSchema);
const uuid = require('uuid');

/**
 * 定义预约表返回字段
 */
const returnAppoParams = `
    appoId
    name
    uid
    avatar
    appoTime
    contactTime
    receptionist
    status
    email
`
/**
 * 根据搜索条件返回预约的所有信息
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
        select: returnAppoParams,
        page,
        limit,
        sort,
    };
    const searchParams = ['name', 'status','receptionist'];
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
                searchRules[data.key] = data.value;
                // if ((data.key === 'name' )||(data.key === 'receptionist') ) {
                //     searchRules[data.key] = new RegExp(data.value);
                // } else {
                    
                // }
            }
        });
    const appoInfo = await appo.paginate(searchRules, roomParams);
    return appoInfo;
}

/**
 * 修改预约状态
 * @param {*} params
 */

exports.changeAppoStatus = async params => {
    console.log(params)
    let appoId = params.appoId;
    let status = params.status;
    const conditions = { appoId: appoId };
    const update = { $set: { status: status } };
    const options = { upsert: true };
    const changeStatusRes = await appo.update(conditions, update, options);
    console.log(changeStatusRes)
    const changeNewAppo = await appo.findOne({ appoId: appoId })
    let result = {
        changeStatusRes: changeStatusRes,
        changeNewAppo: changeNewAppo
    }
    return result;
};