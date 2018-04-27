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
    operater
    operaTime
    contactWay
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
    const searchParams = ['name', 'status','receptionist','uid'];
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
    let appoId = params.appoId;
    let status = params.status;
    const conditions = { appoId: appoId };
    const update = { $set: { status: status } };
    const options = { upsert: true };
    const changeStatusRes = await appo.update(conditions, update, options);
    const changeNewAppo = await appo.findOne({ appoId: appoId })
    let result = {
        changeStatusRes: changeStatusRes,
        changeNewAppo: changeNewAppo
    }
    return result;
};

/**
 * 添加预约
 * @param {*} param
 */

exports.addAppo = async param => {
    const newAppo = new appo({
        appoId: uuid(),
        name: param.name,
        uid: param.uid,
        email: param.email,
        appoTime:param.appoTime,
        contactWay: param.contactWay,
        receptionist:param.receptionist,
        avatar:param.avatar,
        operater:null,
        operaTime:null,
        createTime: Date.parse(new Date()),
        status: 0,
    });
    const saveRes = await newAppo.save();
    return saveRes;
};