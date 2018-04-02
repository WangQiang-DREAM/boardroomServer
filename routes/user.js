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
router.get('/queryAllUser', userController.queryAllUser);

/**
 * 增加管理员
 */
router.get('/addManager', userController.addManager);

/**
 * 删除管理员
 */
router.get('/delManager', userController.delManager);

module.exports = router;