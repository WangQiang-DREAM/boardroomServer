const router = require('koa-router')();
const userController = require('../server/controllers/userController');

/**
 * 登录
 */
router.get('/login', userController.loginIn);
router.get('/logout', userController.loginOut);

/**
 * 查询所有管理员姓名
 */
router.get('/queryUserName', userController.queryUserName);

/**
 * 分页返回所有管理员信息
 */
router.get('/queryAllManager', userController.queryAllUser);
/**
 * 增加管理员
 */
router.get('/addManager', userController.addManager);
/**
 * 删除管理员
 */
router.get('/delManager', userController.delManager);

/**
 * 修改管理员密码
 */
router.get('/updateManagerPassword', userController.updateManagerPassword);

/**
 * 分页返回所有用户信息
 */
router.get('/queryAllUsers', userController.queryAllUsers);
/**
 * 更改用户类型
 */
router.get('/updateUserType', userController.updateUserType);


router.get('/updateUserInfo', userController.updateUserInfo)

router.get('/newUserRegister', userController.newUserRegister);

router.get('/usersLogin', userController.usersLogin)

router.get('/sendSmsCode', userController.sendSmsCode);

/**
 * 分页返回所有评论信息
 */
router.get('/queryComments', userController.queryComments);

//添加评论
router.get('/addComments',userController.addComments)
module.exports = router;