const router = require('koa-router')();
const userController = require('../server/controllers/userController');

/**
 * 注册
 */
router.get('/userRegister', userController.userRegister);

/**
 * 登录
 */
router.post('/userLogin', userController.userLogin);



module.exports = router;