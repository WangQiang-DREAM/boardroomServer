const router = require('koa-router')();
const appoController = require('../server/controllers/appoController');

// 返回预约信息接口
router.get('/queryAppoInfo', appoController.queryAppoInfo);

//添加预约信息
router.post('/addAppo',appoController.addAppo);

//删除预约信息
router.get('/deleteAppo',appoController.deleteAppo);

module.exports = router;