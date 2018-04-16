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
        message: '未注册，请联系管理员',
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
    addManagerSuccess: {
        code: 0,
        message: '增加管理员成功',
    },
    addManagerError: {
        code: 500,
        message: '增加管理员失败',
    },
    managerExist: {
        code: 0,
        message: '管理员已经存在',
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