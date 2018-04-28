const { db } = require('../dbconfig/mongoose');
const userDb = db.useDb('user');
const mongoosePaginate = require('./paginate');
const uuid = require('uuid');

// 连接Manager表
const userSchema = require('../schema/userSchema');
userSchema.plugin(mongoosePaginate);
const user = userDb.model('user', userSchema);

// 链接 users 表
const usersSchema = require('../schema/usersSchema');
usersSchema.plugin(mongoosePaginate);
const users = userDb.model('users', usersSchema);

// 链接 comments 表
const commentsSchema = require('../schema/commentsSchema');
commentsSchema.plugin(mongoosePaginate);
const comments = userDb.model('comments', commentsSchema);

//连接uid表
const uidSchema = require('../schema/uidSchema');
uidSchema.plugin(mongoosePaginate);
const uid = userDb.model('uid', uidSchema);

//连接operateLogs表
const logsSchema = require('../schema/logsSchema');
logsSchema.plugin(mongoosePaginate);
const logs = userDb.model('logs', logsSchema);

const returnUserParams = `
    uid
    username
    roles
    name
`;
const returnUsersParams = `
        uid
        name
        email
        avatar
        registerTime
        checkInTime
        sex
        bedId
        age
        roomOrder
        userType
        familyAddress
        familyName
        familyPhone   
`;
/**
 * 注册
 * @param {*} email
 */
exports.register = async username => {
    let loginResult = user.save({'username': username});
    return loginResult;
};

/**
 * 管理员登录
 * @param {*} email
 */
exports.loginIncheck = async username => {
    let loginResult = user.find({ 'username': username});
    return loginResult;
};
exports.loginIn = async(username, password) => {
    let loginResult = user.findOne({'username': username, 'password': password});
    return loginResult;
};



/**
 * 查询所有管理员userName
 */
exports.queryUserName = async () => {
    let userResult = user.find({});
    return userResult;
}

/**
 * 查询管理员(支持分页及模糊搜索)
 * @param {*} params
 */
exports.queryAllUser = async params => {
    const page = Number(params.pagination.current);
    const limit = Number(params.pagination.pageSize);
    let sort = {};
    if (params.sort && params.sort.key) {
        sort = {
            [params.sort.key]: params.sort.order == 'ascend' ? 1 : -1,
        };
    };
    let userParams = {
        select: returnUserParams,
        page,
        limit,
        sort,
    };
    const searchParams = ['username', 'roles', 'uid'];
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
                if (data.key === 'username') {
                    searchRules[data.key] = new RegExp(data.value);
                } else if (data.key === 'roles') {
                    searchRules[data.key] = parseInt(data.value);
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    const userInfo = await user.paginate(searchRules, userParams);
    return userInfo;
};

/**
 * 增加管理员
 * @param {*} username
 * @param {*} roles
 */
exports.addManager = async (username,name, roles) => {
    const newManager = new user({
        uid: uuid(),
        username: username,
        name:name,
        photo: 'http://localhost:8080/manager/avatar2.jpeg',
        password: '81dc9bdb52d04dc20036dbd8313ed055',
        roles: [roles],
    });
    console.log(12)
    console.log(newManager)
    const saveRes = await newManager.save();
    return saveRes;
};

exports.checkUserExist = async username => {
    const checkUserExist = await user.find({ 'username': username });
    return checkUserExist;
}

/**
 * 删除管理员
 * @param {*} id
 */
exports.delManager = async uid => {
    const removeRes = await user.remove({ 'uid': uid });
    return removeRes;
}

/**
 * 修改管理员密码
 * @param {*} params
 */

exports.updateManagerPassword = async managerInfo => {
    let uid = managerInfo.uid;
    let password = managerInfo.password;
    const conditions = { uid: uid };
    const update = { $set: { password: password } };
    const options = { upsert: true };
    const changeRes = await user.update(conditions, update, options);
    return changeRes;
};

/**
 * 查询用户
 * 
 */
exports.queryAllUsers = async params => {
    const page = Number(params.pagination.current);
    const limit = Number(params.pagination.pageSize);
    let sort = {};
    if (params.sort && params.sort.key) {
        sort = {
            [params.sort.key]: params.sort.order == 'ascend' ? 1 : -1,
        };
    };
    let usersParams = {
        select: returnUsersParams,
        page,
        limit,
        sort
    };
    const searchParams = ['name', 'uid','roomOrder','userType','checkInTime']
    const searchRules = {};
    let starttime = '';
    let endtime = ''
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
                } else if (data.key === 'checkInTime') {
                    starttime = Date.parse(data.value[0])
                    endtime = Date.parse(data.value[1])
                    searchRules['checkInTime'] = { $gte: starttime, $lte: endtime };
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
        const usersInfo = await users.paginate(searchRules, usersParams);
        return usersInfo;
}

/**
 * 查询用户手机号是否被注册
 * @param {*} phone
 */
exports.checkUserPhoneExist = async phone => {
    const checkExist = await users.find({ 'phone': phone });
    return checkExist;
}

/**
 * 变更用户类型
 * @param {*} param
 */

exports.updateUserType = async param => {
    let uid = param.uid;
    let userType = param.userType;
    const conditions = { uid: uid };
    const update = { $set: { userType: userType } };
    const options = { upsert: true };
    const changeRes = await users.update(conditions, update, options);
    return changeRes;
};


/**
 * 查询评论
 * 
 */
exports.queryComments = async params => {
    const page = Number(params.pagination.current);
    const limit = Number(params.pagination.pageSize);
    let sort = {};
    if (params.sort && params.sort.key) {
        sort = {
            [params.sort.key]: params.sort.order == 'ascend' ? 1 : -1,
        };
    };
    let commentsParams = {
        page,
        limit,
        sort
    };
    const searchParams = ['uid', 'roomOrder']
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
            }
        });
    const commentsInfo = await comments.paginate(searchRules, commentsParams);
    return commentsInfo;
}

/**
 * 添加评论
 * @param {*} param
 */

exports.addComments = async param => {
    const newComments = new comments({
        commentId:uuid(),
        rate:param.rate,
        content:param.content,
        roomOrder:param.roomOrder,
        createTime: Date.parse(new Date()),
        status:1,
        user:{
            name:param.name,
            uid:param.uid,
            email:param.email
        }
    });
    const saveRes = await newComments.save();
    return saveRes;
};

/**
 * 变更用户信息
 * @param {*} param
 */

exports.updateUserInfo = async param => {
    let uid = param.uid;
    const conditions = { uid: uid };
    const update = { $set: {
        userType: param.userType,
        name: param.name,
        checkInTime:param.checkInTime,
        age: param.age,
        sex: param.sex,
        roomOrder: param.roomOrder,
        bedId: param.bedId,
        familyName: param.familyName,
        familyAddress: param.familyAddress,
        familyPhone: param.familyPhone,
        idCardNum: param.idCardNum,
        } };
    const options = { upsert: true };
    const changeRes = await users.update(conditions, update, options);
    return changeRes;
};

/**
 * 新用户注册
 * @param {*} param
 */

exports.newUserRegister = async param => {
    const newUser = new users({
        uid: param.uid,
        email: param.email,
        phone: param.phone,
        password: param.password,
        avatar: "http://localhost:8080/user/default.jpg",
        name: '1',
        registerTime: Date.parse(new Date()),
        checkInTime: null,
        sex: null,
        age: null,
        roomOrder: null,
        bedId: 1,
        userType: "1",
        familyAddress: "1",
        familyName: "1",
        familyPhone: 1,
        idCardNum: "1"
    });
    const saveRes = await newUser.save();
    return saveRes;
};

/**
 * 用户登录
 * @param {*} param
 */
exports.usersLogin = async param => {
    console.log(param)
    let loginResult = {};
    if (param.type == '1') {
       loginResult = await users.findOne({ 'email': param.email, 'password': param.password },`uid email avatar phone userType name`);
    } else {
        loginResult = await users.findOne({ 'phone': parseInt(param.phone)},`uid email avatar phone userType name`);
        console.log(loginResult)
    }
    return loginResult;
};

//查询uid
exports.queryUid = async param => {
    const res = await uid.find()
    return res[0]
}
//更改uid
exports.changeUid = async param => {
    const conditions = { _id: param };
    const update = {
        $inc: {
           uid:1
        }
    };
    const options = { upsert: false };
    const changeRes = await uid.update(conditions, update, options);
    return changeRes;
}


/**
 * 查询预约操作日志
 * @param {*} params
 */
exports.queryOperateLogs = async params => {
    const page = Number(params.pagination.current);
    const limit = Number(params.pagination.pageSize);
    let sort = {};
    if (params.sort && params.sort.key) {
        sort = {
            [params.sort.key]: params.sort.order == 'ascend' ? 1 : -1,
        };
    };
    let logsParams = {
        page,
        limit,
        sort,
    };
    const searchParams = ['uid','operateTime'];
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
            }
        });
    const logsInfo = await logs.paginate(searchRules, logsParams);
    return logsInfo;
};


/**
 * 添加操作日志
 * @param {*} param
 */
exports.addLogs = async param => {
    const newOperatelogs = new logs({
        name: param.name,
        uid: param.uid,
        operator:param.operator,
        operatorAvatar:param.operatorAvatar,
        operateTime: Date.parse(new Date()),
        status: param.status,   
    });
    const saveRes = await newOperatelogs.save();
    return saveRes;
};