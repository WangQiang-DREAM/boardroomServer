const router = require('koa-router')();
const appoController = require('../server/controllers/appoController');

// 返回预约信息接口
router.get('/queryAppoInfo', appoController.queryAppoInfo);

// 修改预约状态
router.get('/changeAppoStatus',appoController.changeAppoStatus)

module.exports = router;