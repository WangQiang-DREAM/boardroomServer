const { db } = require('../dbconfig/mongoose');
const userDb = db.useDb('countroom');
const mongoosePaginate = require('./paginate');
const uuid = require('uuid');
const util = require('../util');

// 连接users表
const userSchema = require('../schema/userSchema');
userSchema.plugin(mongoosePaginate);
const user = userDb.model('user', userSchema);

/**
 * 用户注册
 * @param {*} params 
 */
exports.userRegister = async params => {
    const newUser = new user({
        uid: uuid(),
        name: params.name,
        phone: params.phone,
        password: params.password,
        department: params.department,
        floor: util.returnFloorByDep(params.department)
    });
    const saveRes = await newUser.save();
    return saveRes;
};

/**
 * 用户是否存在检测
 * @param {*} phone
 */
exports.checkUserExist = async phone => {
    const checkUserExist = await user.find({
        'phone': phone
    });
    return checkUserExist;
}

/**
 * 用户登录
 * @param {*} phone 
 * @param {*} password 
 */
exports.userLogin = async (phone, password) => {
    let loginResult = user.findOne({
        phone: phone,
        password: password
    });
    return loginResult;
};