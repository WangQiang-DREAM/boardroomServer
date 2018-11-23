const codeConfig = {
    success: {
        code: 0,
        message: '请求成功',
    },
    error: {
        code: 500,
        message: '系统错误',
    },
    changeRoomSuccess: {
        code: 0,
        message: '修改成功',
    },
    changeRoomFail: {
        code: 500,
        message: '修改失败',
    },
    deleteAppoSuccess:{
        code: 0,
        message: '删除成功',
    },
    deleteAppoError: {
        code: 0,
        message: '删除失败',
    },
    changeRoomStatusFail: {
        code: 0,
        message: '未找到该房间',
    },
    login: {
        code: 201,
        message: '登录成功',
    },
    logout: {
        code: 401,
        message: '退出成功',
    },
    noUser: {
        code: 405,
        message: '未注册，用户不存在',
    },
    exportSuccess: {
        code: 0,
        message: '导出数据成功',
    },
    exportError: {
        code: 1,
        message: '导出数据失败',
    },
    importDataSuccess: {
        code: 0,
        message: '导入数据成功',
    },
    importDataError: {
        code: 1,
        message: '导入数据失败',
    },
    queryUserSuccess: {
        code: 0,
        message: '查询用户成功',
    },
    queryUserError: {
        code: 1,
        message: '查询用户失败',
    },
    addUserSuccess: {
        code: 0,
        message: '注册用户成功',
    },
    addUserError: {
        code: 500,
        message: '注册用户失败',
    },
    userExist: {
        code: 0,
        message: '用户已经存在',
    },
    roomExist: {
        code: 0,
        message: '房间号已经存在',
    },
    delManagerSuccess: {
        code: 0,
        message: '删除管理员成功',
    },
    delManagerError: {
        code: 0,
        message: '删除管理员失败',
    },
    passwordError: {
        code: 505,
        message: '密码错误',
    },
    
};

module.exports = codeConfig;